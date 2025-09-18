
```markdown
# 🌍 ResQHub – Disaster Response & Relief Camp Management System

ResQHub is a web-based platform designed to **coordinate disaster relief efforts**, manage camp resources, and enable volunteers to collaborate seamlessly.  
The system empowers communities during crises by ensuring **real-time information flow**, efficient **resource management**, and **faster decision-making**.  

---

## 🚀 Features

- 🔐 **Volunteer Registration & Login** – Secure authentication and personalized dashboards.  
- 🏕 **Camp Management** – Create, update, and manage relief camps with resident records.  
- 👥 **Resident Registration** – Record personal details, medical conditions, and family info.  
- 📢 **Incident Reporting** – Volunteers can log incidents and updates for quick response.  
- 📂 **Volunteer Forum** – A space for posting updates and coordination.  
- 📍 **Find Nearby Camps** – Mapbox integration to locate shelters in real time.  
- 📊 **Camp Statistics** – View resident counts, statuses, and camp health data.  
- ☎️ **Emergency Contacts** – Centralized directory of important contacts.  
- 🎮 **Awareness Quiz** – Interactive module for disaster preparedness training.  
- 📧 **Email Subscription** – Stay updated with alerts and newsletters.  

---

## 🛠️ Tech Stack

### **Frontend**
- [Angular 16](https://angular.io/) – Component-based UI framework  
- [Tailwind CSS](https://tailwindcss.com/) & Angular Material – Modern styling  
- [Mapbox GL JS](https://www.mapbox.com/) – Interactive maps  

### **Backend & Database**
- [Supabase](https://supabase.com/) – Postgres database + Authentication + Edge Functions  

### **Other Tools**
- Node.js v18+  
- npm for package management  
- Git for version control  

---

## 📂 Project Structure

```

src/
├── app/
│    ├── components/       # Angular components (dashboard, forms, footer, etc.)
│    ├── services/         # Supabase and utility services
│    ├── guards/           # Auth guards for route protection
│    └── environments/     # Supabase environment configs

````

---

## ⚙️ Installation & Setup

Clone the repository:
```bash
git clone https://github.com/your-username/resqhub.git
cd resqhub
````

Install dependencies:

```bash
npm install
```

Set up environment variables in `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseKey: 'your-anon-or-service-role-key',
  mapboxToken: 'your-mapbox-access-token'
};
```

Run the development server:

```bash
ng serve
```

Navigate to **[http://localhost:4200/](http://localhost:4200/)** 🚀

---

## ✅ Testing

* **Unit Testing** – Angular test bed for components & services.
* **Integration Testing** – Verified Supabase and Mapbox API integration.
* **User Testing** – Feedback from volunteers on usability & responsiveness.

---

## 📌 Future Enhancements

* AI-driven disaster prediction and alerts
* Offline-first support for areas with poor connectivity
* Mobile application for field volunteers
* Multi-language support for inclusivity

---

## 👩‍💻 Contributors

* Adhul Krishna V S
* Faheem Hamza
* Alvin K K
* Sneha Sunil (me)

---

## 📜 License

This project is licensed under the MIT License – feel free to use and improve it.

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch

   ```bash
   git checkout -b feature-branch
   ```
3. Commit changes

   ```bash
   git commit -m "Add new feature"
   ```
4. Push branch

   ```bash
   git push origin feature-branch
   ```
5. Open a Pull Request 🎉


