# Olivia 🚀

**Olivia** is a custom-designed, bare-metal Platform as a Service (PaaS) built for high-performance deployment and management of containerized full-stack applications.

Unlike traditional cloud providers, Olivia runs directly on Ubuntu (DragoUltra), providing a Vercel-like experience with total control over infrastructure, networking, and security.

---

## 🛠 Core Architecture

- **Reverse Proxy Gateway:** A centralized `master-nginx` container that dynamically routes traffic to project-specific frontends and API servers.
- **Isolated Networking:** Every project is deployed on its own private Docker bridge network (`internal-bridge`), keeping databases invisible to the public internet.
- **On-Demand DB Management:** Features a custom `DbManager` that bridges a central **Adminer** instance to a project's private network only when an administrator needs to manage the database.
- **Automatic VHost Generation:** Automatically generates and injects Nginx configuration files into the master gateway for seamless scaling.

---

## 🏗 System Components

| Component | Role | Technology |
| :--- | :--- | :--- |
| **Gateway** | Master Reverse Proxy | Nginx (Docker) |
| **Manager** | Orchestration & Networking | Node.js / TypeScript |
| **Database UI** | Centralized DB Access | Adminer |
| **Storage** | Persistent Volumes | Docker Volumes |

---

## 🚀 Key Features

### 1. Dynamic Networking
Olivia creates a fresh `internal-bridge` for every deployment. This ensures that the frontend, API, and DB can communicate locally, while the DB remains inaccessible from the outside world.

### 2. The DbManager Bridge
A specialized OOP-based manager handles the "Network Bridging" logic. 
- **POST `/api/db/manage`**: Bridges the project network to the `master-adminer`.
- **Magic URL**: Generates a pre-filled Adminer link with the internal server name and credentials.

### 3. Persistent Bare-Metal Setup
Configurations are mounted from the host (`~/nginx-gateway/conf.d`) into containers, allowing for persistent settings and easy debugging directly from the Ubuntu terminal.

---

## 🛠 Quick Start (Infrastructure)

To spin up the core Olivia infrastructure:

```bash
# 1. Start the Master Gateway
docker run -d --name master-nginx --network web-gateway -p 80:80 -v ~/nginx-gateway/conf.d:/etc/nginx/conf.d nginx:alpine

# 2. Start the Central Adminer
docker run -d --name master-adminer --network web-gateway -p 8080:8080 adminer