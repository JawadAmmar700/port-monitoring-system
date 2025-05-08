import { io, Socket } from "socket.io-client";

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private error: string | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(): void {
    if (this.socket) return;

    this.socket = io(
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
    );

    this.socket.on("connect", () => {
      this.isConnected = true;
      this.error = null;
    });

    this.socket.on("connect_error", () => {
      this.isConnected = false;
      this.error = "Server is down. Please try again later.";
    });

    this.socket.on("disconnect", () => {
      this.isConnected = false;
      this.error = "Server connection lost. Please try again later.";
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public getConnectionStatus(): { isConnected: boolean; error: string | null } {
    return {
      isConnected: this.isConnected,
      error: this.error,
    };
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketService = SocketService.getInstance();
