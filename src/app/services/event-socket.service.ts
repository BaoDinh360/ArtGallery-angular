import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventSocketService {

  private dataReceived = new BehaviorSubject<any>(undefined);
  private dataReceived$ = this.dataReceived.asObservable();

  constructor(
    private socket: Socket
  ) { 
    
  }

  getConnectedSocket(){
    return this.socket;
  }
  getDataReceived(){
    return this.dataReceived$;
  }
  connectSocket(data: any){
    this.socket.connect();
    this.socket.emit('user-connected', data);
  }
  disconnectSocket(data: any){
    this.socket.emit('user-disconnected', data);
    this.socket.disconnect();
  }
  emitData(eventName: string, data: any){
    this.socket.emit(eventName, data);
  }
  receivedEmitedData(eventName: string){
    this.socket.on(eventName, (data: any) =>{
      this.dataReceived.next(data);
    })
  }

  listenToEmitEvent(eventName: string, execFunc: Function){
    this.socket.on(eventName, (data: any) =>{
      execFunc(data);
    });
  }

  stopEventListener(eventName: string){
    this.socket.removeListener(eventName);

  }
}
