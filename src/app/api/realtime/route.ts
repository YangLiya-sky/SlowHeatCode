import { NextRequest, NextResponse } from 'next/server';
import { addConnection, removeConnection, broadcastToClients, notifyDataUpdate } from '@/lib/realTimeNotify';



// SSE 端点
export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      // 添加到连接集合
      addConnection(controller);

      // 发送初始连接消息
      const welcomeMessage = `data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`;
      controller.enqueue(new TextEncoder().encode(welcomeMessage));

      // 发送初始数据
      notifyDataUpdate('analytics').then(() => {
        // Analytics data will be sent via broadcast
      });

      notifyDataUpdate('media').then(() => {
        // Media data will be sent via broadcast
      });

      // 设置心跳
      const heartbeat = setInterval(() => {
        try {
          const heartbeatMessage = `event: heartbeat\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`;
          controller.enqueue(new TextEncoder().encode(heartbeatMessage));
        } catch (error) {
          clearInterval(heartbeat);
          removeConnection(controller);
        }
      }, 30000); // 每30秒发送心跳

      // 清理函数
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        removeConnection(controller);
        controller.close();
      });
    },
    cancel(controller) {
      removeConnection(controller);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}


