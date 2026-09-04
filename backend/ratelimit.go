package main

import (
	"net"
	"net/http"
	"sync"
	"time"
)

// rateLimiter throttles submissions per client IP.
//
// Deliberately in-memory: fly.toml runs this app with min_machines_running = 0
// and auto_stop_machines, so the map is lost whenever the machine sleeps, and a
// second machine would keep its own counts. That is an accepted limit — this
// exists to stop a burst from one source, which is the abuse pattern a public
// contact form actually sees. A determined distributed flood needs Fly-side or
// upstream limiting, not this.
type rateLimiter struct {
	mu       sync.Mutex
	seen     map[string]time.Time
	interval time.Duration
}

func newRateLimiter(interval time.Duration) *rateLimiter {
	return &rateLimiter{seen: map[string]time.Time{}, interval: interval}
}

// allow reports whether ip may submit now, and records the attempt if so.
// Sweeping expired entries on each call keeps the map bounded by the number of
// clients active within one interval, so a flood of unique IPs cannot grow it
// without limit.
func (rl *rateLimiter) allow(ip string, now time.Time) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	for addr, at := range rl.seen {
		if now.Sub(at) >= rl.interval {
			delete(rl.seen, addr)
		}
	}

	if last, ok := rl.seen[ip]; ok && now.Sub(last) < rl.interval {
		return false
	}

	rl.seen[ip] = now
	return true
}

// clientIP prefers the header Fly sets, because behind Fly's proxy
// r.RemoteAddr is the proxy rather than the visitor. Falling back to
// RemoteAddr keeps the limiter working when running locally.
//
// Only Fly-Client-IP is trusted. X-Forwarded-For is caller-supplied and would
// let anyone bypass the limit by varying it.
func clientIP(r *http.Request) string {
	if ip := r.Header.Get("Fly-Client-IP"); ip != "" {
		return ip
	}
	if host, _, err := net.SplitHostPort(r.RemoteAddr); err == nil {
		return host
	}
	return r.RemoteAddr
}
