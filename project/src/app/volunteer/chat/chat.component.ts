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
    <div class="forum-container">
      <div class="forum-header">
        <div class="container">
          <h1>Volunteer Forum</h1>
          <p>Updates and discussions from relief camp volunteers</p>
        </div>
      </div>

      <div class="container forum-content">
        <div class="forum-posts card">
          <!-- Post creation form for volunteers only -->
          <div *ngIf="isVolunteer" class="post-creation-form">
            <h3>Create New Post</h3>
            <form (ngSubmit)="sendMessage()">
              <div class="form-group">
                <textarea 
                  [(ngModel)]="newMessage"
                  name="message"
                  class="form-textarea"
                  placeholder="Share updates, information, or questions with the community..."
                  rows="4"
                  required></textarea>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary" [disabled]="!newMessage.trim()">
                    Post Update
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- Notice for non-volunteers -->
          <div *ngIf="!isVolunteer" class="non-volunteer-notice">
            <p>You are viewing the volunteer forum in read-only mode. Only registered volunteers can post updates.</p>
          </div>

          <div class="posts-divider" *ngIf="messages.length > 0">
            <h3>Recent Updates</h3>
          </div>

          <!-- Forum posts list -->
          <div class="posts-container">
            <div *ngFor="let message of messages" class="post-card">
              <div class="post-header">
                <div class="post-author">
                  <span class="author-name">{{ message.author_name }}</span>
                  <span class="camp-badge">{{ message.camp_name }}</span>
                </div>
                <span class="post-time">{{ formatTime(message.created_at) }}</span>
              </div>
              <div class="post-content">
                {{ message.content }}
              </div>
              <div class="post-footer" *ngIf="message.user_id === currentUser?.user_id">
                <button class="btn btn-text" (click)="deleteMessage(message.id)" *ngIf="isVolunteer">Delete</button>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div *ngIf="messages.length === 0" class="empty-state">
            <p>No updates have been posted yet.</p>
          </div>
        </div>

        <div class="forum-sidebar">
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
    .forum-container {
      min-height: calc(100vh - 72px);
      background: var(--background);
    }

    .forum-header {
      background: #229954;
      color: white;
      padding: 2rem 0;
    }

    .forum-header h1 {
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }

    .forum-content {
      padding: 2rem 1.5rem;
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 1.5rem;
    }

    .forum-posts {
      min-height: calc(100vh - 250px);
      display: flex;
      flex-direction: column;
    }

    .posts-container {
      flex-grow: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    .post-card {
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .post-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }

    .post-author {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .author-name {
      font-weight: 600;
      color: #229954;
      font-size: 1rem;
    }

    .camp-badge {
      display: inline-block;
      background: rgba(34, 153, 84, 0.1);
      color: #229954;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }

    .post-time {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .post-content {
      margin-bottom: 1rem;
      line-height: 1.6;
      white-space: pre-line;
    }

    .post-footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(0,0,0,0.05);
    }

    .post-creation-form {
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 1.5rem;
    }

    .post-creation-form h3 {
      margin-bottom: 1rem;
      color: #229954;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid rgba(0,0,0,0.2);
      border-radius: 4px;
      resize: vertical;
      font-family: inherit;
      font-size: 1rem;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .form-textarea:focus {
      outline: none;
      border-color: #229954;
      box-shadow: 0 0 0 2px rgba(34, 153, 84, 0.2);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
    }

    .non-volunteer-notice {
      padding: 1rem;
      background: rgba(255, 193, 7, 0.1);
      border-left: 4px solid #ffc107;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }

    .posts-divider {
      padding: 0 1rem;
      margin-bottom: 1rem;
    }

    .posts-divider h3 {
      color: #229954;
      position: relative;
      padding-bottom: 0.5rem;
    }

    .posts-divider h3:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 3px;
      background: #229954;
    }

    .empty-state {
      padding: 2rem;
      text-align: center;
      color: var(--text-secondary);
    }

    .btn-text {
      background: transparent;
      color: #e74c3c;
      border: none;
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .btn-text:hover {
      color: #c0392b;
      text-decoration: underline;
    }

    .active-camps {
      height: calc(100vh - 250px);
      overflow-y: auto;
    }

    .active-camps h3 {
      margin-bottom: 1rem;
      color: #229954;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid rgba(34, 153, 84, 0.2);
    }

    .camp-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .camp-item {
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.2s ease;
    }

    .camp-item:hover {
      transform: translateY(-2px);
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
      background: rgba(34, 153, 84, 0.05);
      padding: 0.5rem;
      border-radius: 4px;
    }

    .btn-primary {
      background: #229954;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
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

    @media (max-width: 1200px) {
      .forum-content {
        grid-template-columns: 1fr 250px;
      }
    }

    @media (max-width: 992px) {
      .forum-content {
        padding: 1.5rem 1rem;
      }

      .forum-header h1 {
        font-size: 1.75rem;
      }
    }

    @media (max-width: 768px) {
      .forum-content {
        grid-template-columns: 1fr;
        padding: 1rem;
      }

      .forum-posts {
        min-height: auto;
        margin-bottom: 1.5rem;
      }

      .active-camps {
        height: auto;
        max-height: 300px;
      }

      .post-card {
        padding: 1.25rem;
      }

      .post-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .forum-header {
        padding: 1.5rem 0;
      }

      .forum-header h1 {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 576px) {
      .forum-content {
        padding: 0.75rem;
      }

      .post-card {
        padding: 1rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .form-actions .btn {
        width: 100%;
      }

      .camp-item {
        padding: 1rem;
      }

      .camp-stats {
        flex-direction: column;
        gap: 0.25rem;
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
      // Check if user is a volunteer
      this.isVolunteer = user && user.role === 'volunteer';
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
    }));
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
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async sendMessage() {
    if (!this.newMessage.trim() || !this.currentUser || !this.isVolunteer) return;

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

  async deleteMessage(messageId: string) {
    if (!this.isVolunteer || !this.currentUser) return;

    const { error } = await this.supabase
      .from('camp_updates')
      .delete()
      .eq('id', messageId)
      .eq('user_id', this.currentUser.user_id); // Ensure only the author can delete

    if (error) {
      console.error('Error deleting message:', error);
      return;
    }

    // Remove the message from the local array
    this.messages = this.messages.filter(msg => msg.id !== messageId);
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
          this.messages.unshift({
            ...message,
            author_name: message.volunteer_profiles.full_name,
            camp_name: message.camps.name
          });
        }
      })
      .subscribe();
  }
}
