# VEGA ERP - 5-Minute Interview Cheat Sheet

This is your conversational cheat sheet for **VEGA ERP**. Use these exact talking points during your interview to explain the "why" behind your technical decisions.

---

## 1. The "Elevator Pitch" (Start the interview with this)
* **What to say:** "VEGA ERP is a high-speed, local-first desktop billing software built for FMCG distributors, modeled after industry standards like Marg and Tally. I built it using **Java 21, Spring Boot, and JavaFX**, backed by a local **H2 Database**. I also built a companion **Node.js Mobile Web App** for field salesmen to punch orders remotely, which syncs directly back to the desktop ERP's Spring Boot REST APIs over the local network."

## 2. Keyboard-First Architecture (Your UX/UI flex)
Most developers build web apps where users click everywhere. You built a system for *data-entry speed*.
* **How to explain it:** 
  * "Distributor operators punch hundreds of bills a day. They don't have time to use a mouse. I had to rip out standard JavaFX UI patterns and build a **Keyboard-First Event System**."
  * "I engineered a custom navigation flow where pressing `Enter` seamlessly hops focus between `Customer -> Item Search -> Quantity -> Rate`, and pressing `F8` instantly opens a modal to pull pending field orders."
  * "This required heavy manipulation of JavaFX's `FocusModel` and intercepting low-level `KeyEvent` codes to prevent default tab behaviors, increasing billing speed by over 300%."

## 3. Solving Complex Database State Issues (Your backend flex)
Talk about the specific bug you fixed regarding converting "Pending Orders" to "Invoices". This proves you deeply understand Hibernate/JPA.
* **How to explain it:**
  * "I ran into a serious issue where converting a salesman's mobile order into a final invoice crashed silently. The issue was a mix of a **Unique Constraint Violation** and a **LazyInitializationException**."
  * "When I loaded the order from the database to show on the UI, the Hibernate Session closed, making the object 'detached'. When the operator clicked Save, trying to clear the `lineItems` array crashed the thread because the lazy-loaded collection wasn't initialized."
  * "I solved this by writing a custom `@Transactional` method in the Service layer that explicitly initialized the collections before returning the object to the JavaFX controller. This ensured the detached object could be properly merged and saved without crashing."

## 4. Seamless Security Upgrades (Handling legacy data)
You didn't just add security; you handled backward compatibility.
* **How to explain it:**
  * "Halfway through the project, I needed to secure the system for production by implementing **BCrypt Password Encoding**. However, my local database already had users (like 'billing' and 'admin') stored with plain-text passwords."
  * "If I just turned on BCrypt, all existing operators would be locked out. So, I wrote a **backward-compatibility fallback** in my `AuthService`. When a user logs in, the system checks if their stored hash starts with `$2a$` (the BCrypt prefix). If not, it falls back to a plain-text check, logs them in, and *silently auto-upgrades* their password to BCrypt in the database behind the scenes."

## 5. The Mobile-to-Desktop Sync (System Integration)
* **How to explain it:**
  * "The desktop app doesn't just run JavaFX; it simultaneously boots up an embedded **Tomcat Web Server** on port 8080 via Spring Boot."
  * "I built a mobile web app using JavaScript that field agents open on their phones. It connects to the desktop's local IP address and submits JSON payloads to my Spring Boot `@RestController` endpoints."
  * "This effectively turned the desktop application into an active local server, combining desktop speed with mobile flexibility without needing expensive cloud hosting."
