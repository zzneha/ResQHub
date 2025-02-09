import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 class="text-4xl font-bold mb-4">Emergency Response System</h1>
            <p class="text-xl mb-6">Real-time disaster management and community support</p>
            <div class="bg-white bg-opacity-20 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">Latest Incidents</h3>
              <div class="space-y-2">
                <!-- Incidents will be populated here -->
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white bg-opacity-20 p-6 rounded-lg text-center">
              <i class="bi bi-people-fill text-3xl"></i>
              <h4 class="mt-2">Active Volunteers</h4>
              <p class="text-2xl font-bold">157</p>
            </div>
            <div class="bg-white bg-opacity-20 p-6 rounded-lg text-center">
              <i class="bi bi-house-check-fill text-3xl"></i>
              <h4 class="mt-2">Available Shelters</h4>
              <p class="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <main class="container mx-auto px-4 py-8">
      <section id="training" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Disaster Preparedness Training</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4">Interactive Quiz</h3>
            <div class="space-y-4">
              <div class="font-medium">{{ currentQuestion?.question }}</div>
              <div class="space-y-2">
                <button *ngFor="let option of currentQuestion?.options; let i = index"
                  (click)="checkAnswer(i)"
                  class="w-full p-3 text-left quiz-option rounded border hover:bg-gray-100">
                  {{ option }}
                </button>
              </div>
              <button *ngIf="showNextButton"
                (click)="nextQuestion()"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Next Question
              </button>
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4">Emergency Contacts</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span>Emergency Hotline</span>
                <a href="tel:911" class="text-blue-600">911</a>
              </div>
              <div class="flex items-center justify-between">
                <span>Medical Emergency</span>
                <a href="tel:108" class="text-blue-600">108</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="shelters" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Find Nearby Shelters</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div *ngFor="let shelter of shelters" 
            class="bg-white p-6 rounded-lg shadow-md shelter-card">
            <h3 class="font-semibold mb-2">{{ shelter.name }}</h3>
            <p class="text-gray-600 mb-2">{{ shelter.address }}</p>
            <div class="flex justify-between items-center">
              <span class="text-sm">Available: {{ shelter.available }}/{{ shelter.capacity }}</span>
              <button class="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Details
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .shelter-card:hover { 
      transform: translateY(-5px); 
      transition: transform 0.3s; 
    }
    .quiz-option:hover { 
      background-color: #E5E7EB; 
    }
  `]
})
export class HomeComponent {
  quizData = [
    {
      question: "What should you do first in case of an earthquake?",
      options: ["Run outside", "Drop, Cover, and Hold On", "Call emergency services", "Stand in a doorway"],
      correct: 1
    },
    {
      question: "Which item is NOT essential in an emergency kit?",
      options: ["Water", "Television", "First aid supplies", "Non-perishable food"],
      correct: 1
    }
  ];

  shelters = [
    { name: "Community Center", capacity: "50", available: "35", address: "123 Main St" },
    { name: "High School Gym", capacity: "100", available: "72", address: "456 Oak Ave" },
    { name: "Recreation Center", capacity: "75", available: "45", address: "789 Pine Rd" }
  ];

  currentQuestionIndex = 0;
  score = 0;
  showNextButton = false;

  get currentQuestion() {
    return this.quizData[this.currentQuestionIndex];
  }

  checkAnswer(selected: number) {
    const correct = this.quizData[this.currentQuestionIndex].correct;
    if (selected === correct) this.score++;
    this.showNextButton = true;
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    this.showNextButton = false;
    if (this.currentQuestionIndex >= this.quizData.length) {
      // Quiz completed
      this.currentQuestionIndex = 0;
      // Could show a completion message here
    }
  }
}