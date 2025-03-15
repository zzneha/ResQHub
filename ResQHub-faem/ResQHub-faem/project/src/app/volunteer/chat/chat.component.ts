import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <div class="container">
          <h1>Camp Updates</h1>
          <p>Real-time updates from all relief camps</p>
        </div>
      </div>

      <div class="container chat-content">
        <div class="chat-messages card">
          <div class="messages-container">
            <div *ngFor="let message of messages" 
                 class="message" 
                 [ngClass]="{'own-message': message.user_id === currentUser?.user_id}">
              <div class="message-header">
                <span class="author">{{ message.author_name }}</span>
                <span class="time">{{ formatTime(message.created_at) }}</span>
              </div>
              <div class="message-content">
                {{ message.content }}
              </div>
              <div class="message-footer">
                <span class="camp-name">{{ message.camp_name }}</span>
              </div>
            </div>
          </div>

          <div *ngIf="isVolunteer" class="message-input">
            <form (ngSubmit)="sendMessage()">
              <div class="input-group">
                <input 
                  type="text" 
                  [(ngModel)]="newMessage"
                  name="message"
                  class="form-input"
                  placeholder="Type your update here..."
                  required>
                <button type="submit" class="btn btn-primary" [disabled]="!newMessage.trim()">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="chat-sidebar">
          <div class="active-camps card">
            <h3>Active Camps</h3>
            <div class="camp-list">
              <div *ngFor="let camp of camps" class="camp-item">
                <h4>{{ camp.name }}</h4>
                <p>{{ camp.location }}</p>
                <div class="camp-stats">
                  <span>Capacity: {{ camp.capacity }}</span>
                  <span>Current: {{ camp.current_occupancy }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      min-height: calc(100vh - 72px);
      background: var(--background);
    }

    .chat-header {
      background: #229954;
      color: white;
      padding: 2rem 0;
    }

    .chat-header h1 {
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }

    .chat-content {
      padding: 2rem 1.5rem;
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 1.5rem;
    }

    .chat-messages {
      height: calc(100vh - 250px);
      display: flex;
      flex-direction: column;
    }

    .messages-container {
      flex-grow: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    .message {
      margin-bottom: 1rem;
      padding: 1rem;
      background: rgba(34, 153, 84, 0.1);
      border-radius: 8px;
      max-width: 80%;
    }

    .own-message {
      margin-left: auto;
      background: rgba(34, 153, 84, 0.2);
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .author {
      font-weight: 500;
      color: #229954;
    }

    .time {
      color: var(--text-secondary);
    }

    .message-content {
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }

    .message-footer {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .camp-name {
      font-style: italic;
    }

    .message-input {
      padding: 1rem;
      border-top: 1px solid rgba(0,0,0,0.1);
    }

    .input-group {
      display: flex;
      gap: 0.5rem;
    }

    .active-camps {
      height: calc(100vh - 250px);
      overflow-y: auto;
    }

    .active-camps h3 {
      margin-bottom: 1rem;
    }

    .camp-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .camp-item {
      padding: 1rem;
      background: rgba(34, 153, 84, 0.1);
      border-radius: 8px;
    }

    .camp-item h4 {
      margin-bottom: 0.25rem;
      color: #229954;
    }

    .camp-item p {
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .camp-stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .btn-primary {
      background: #229954;
      color: white;
      border: none;
      transform: translateY(0);
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      background: #1a7441;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(34, 153, 84, 0.2);
    }

    .btn-primary:disabled {
      background: #95a5a6;
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    @media (max-width: 768px) {
      .chat-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ChatComponent implements OnInit, OnDestroy {
  private supabase: SupabaseClient;
  private channel?: RealtimeChannel;
  
  currentUser: any = null;
  isVolunteer = false;
  messages: any[] = [];
  camps: any[] = [];
  newMessage = '';

  constructor(private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isVolunteer = !!user;
    });

    this.loadMessages();
    this.loadCamps();
    this.subscribeToMessages();
  }

  ngOnDestroy() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel);
    }
  }

  async loadMessages() {
    const { data, error } = await this.supabase
      .from('camp_updates')
      .select(`
        *,
        volunteer_profiles(full_name),
        camps(name)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    this.messages = data.map(msg => ({
      ...msg,
      author_name: msg.volunteer_profiles.full_name,
      camp_name: msg.camps.name
    })).reverse();
  }

  async loadCamps() {
    const { data, error } = await this.supabase
      .from('camps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading camps:', error);
      return;
    }

    this.camps = data;
  }
  formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

 async sendMessage() {
  if (!this.newMessage.trim() || !this.currentUser) return;

  const { error } = await this.supabase
    .from('camp_updates')
    .insert({
      content: this.newMessage,
      user_id: this.currentUser.user_id,
      camp_id: this.currentUser.camp_id
    });

  if (error) {
    console.error('Error sending message:', error);
    return;
  }

  this.newMessage = ''; // Clear input after sending
}

  subscribeToMessages() {
    this.channel = this.supabase
      .channel('camp_updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'camp_updates'
      }, async (payload: { new: { id: string } }) => { 
        const { data: message, error } = await this.supabase
          .from('camp_updates')
          .select(`
            *,
            volunteer_profiles(full_name),
            camps(name)
          `)
          .eq('id', payload.new['id'])
          .single();

        if (!error && message) {
          this.messages.push({
            ...message,
            author_name: message.volunteer_profiles.full_name,
            camp_name: message.camps.name
          });
        }
      })
      .subscribe();
  }
}
