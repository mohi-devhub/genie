/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or Upstash
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per interval
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Clean up old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (e.g., user ID, IP address)
   * @returns Object with allowed status and remaining requests
   */
  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    // No entry or expired entry
    if (!entry || now > entry.resetTime) {
      const resetTime = now + this.config.interval;
      this.store.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: this.config.maxRequests - 1, resetTime };
    }

    // Check if limit exceeded
    if (entry.count >= this.config.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    // Increment count
    entry.count++;
    this.store.set(identifier, entry);
    return { 
      allowed: true, 
      remaining: this.config.maxRequests - entry.count, 
      resetTime: entry.resetTime 
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup() {
    const now = Date.now();
    const keys = Array.from(this.store.keys());
    for (const key of keys) {
      const entry = this.store.get(key);
      if (entry && now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset(identifier: string) {
    this.store.delete(identifier);
  }

  /**
   * Get current status for an identifier
   */
  getStatus(identifier: string): { requests: number; resetTime: number } | null {
    const entry = this.store.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return null;
    }
    return { requests: entry.count, resetTime: entry.resetTime };
  }
}

// Pre-configured rate limiters for different use cases
export const rateLimiters = {
  // General API calls: 100 requests per minute
  api: new RateLimiter({ interval: 60 * 1000, maxRequests: 100 }),
  
  // Authentication: 10 attempts per 15 minutes
  auth: new RateLimiter({ interval: 15 * 60 * 1000, maxRequests: 10 }),
  
  // Prompt submission: 10 per hour (already implemented in router, this is backup)
  promptSubmit: new RateLimiter({ interval: 60 * 60 * 1000, maxRequests: 10 }),
  
  // Voting: 100 votes per minute
  voting: new RateLimiter({ interval: 60 * 1000, maxRequests: 100 }),
};

/**
 * Helper function to get client identifier
 * In production, you might want to use IP address from request headers
 */
export function getClientIdentifier(userId?: string, fallbackId?: string): string {
  return userId || fallbackId || 'anonymous';
}
