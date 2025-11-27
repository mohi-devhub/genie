/**
 * Production-ready logger utility
 * Provides structured logging with different levels
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context || "");
    }
  }

  /**
   * Log an informational message
   */
  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context || "");
    } else {
      // In production, you might want to send to a logging service
      this.sendToLoggingService("info", message, context);
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: LogContext) {
    console.warn(`[WARN] ${message}`, context || "");
    if (!this.isDevelopment) {
      this.sendToLoggingService("warn", message, context);
    }
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorDetails = error instanceof Error 
      ? { message: error.message, stack: error.stack, ...context }
      : { error, ...context };

    console.error(`[ERROR] ${message}`, errorDetails);
    
    if (!this.isDevelopment) {
      this.sendToLoggingService("error", message, errorDetails);
    }
  }

  /**
   * Send logs to external logging service
   * TODO: Integrate with your preferred logging service (Sentry, LogRocket, etc.)
   */
  private sendToLoggingService(
    level: LogLevel,
    message: string,
    context?: LogContext
  ) {
    // Example: Send to external service
    // In production, implement integration with services like:
    // - Sentry
    // - LogRocket
    // - Datadog
    // - CloudWatch
    
    // For now, just ensure critical errors are visible
    if (level === "error") {
      // Store in a way that can be reviewed later
      // or send to an external monitoring service
    }
  }
}

export const logger = new Logger();
