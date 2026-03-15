import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private msg: MessageService) {}
  success(s: string, d?: string) { this.msg.add({severity:'success',summary:s,detail:d??''  ,life:3000}); }
  error(s: string, d?: string)   { this.msg.add({severity:'error',summary:s,detail:d??''    ,life:5000}); }
  warn(s: string, d?: string)    { this.msg.add({severity:'warn',summary:s,detail:d??''     ,life:4000}); }
  info(s: string, d?: string)    { this.msg.add({severity:'info',summary:s,detail:d??''     ,life:3000}); }
}
