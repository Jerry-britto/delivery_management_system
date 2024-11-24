# Smart Delivery Management System

## Overview
A modern delivery management dashboard focused on partner management and smart order assignments. The system helps manage delivery partners, track orders, and efficiently assign deliveries based on various parameters.

## Features

### 1. Partner Management
- Partner registration and onboarding
- Comprehensive partner listing view
- Profile management and editing capabilities
- Area-based management system
- Shift scheduling functionality

### 2. Order Processing
- Interactive orders dashboard
- Real-time status tracking
- Detailed assignment history
- Performance metrics visualization

### 3. Assignment System
Smart system for matching orders with delivery partners

## Core Pages

### Dashboard (/)
Main control center featuring:
- Key performance metric cards
- Interactive order map
- Real-time partner availability status
- Recent assignment logs

### Partners (/partners)
Partner management interface with:
```typescript
type PartnersPageProps = {
    partners: DeliveryPartner[];
    metrics: {
        totalActive: number;
        avgRating: number;
        topAreas: string[];
    };
}
```

### Orders (/orders)
Order management interface with:
```typescript
type OrdersPageProps = {
    orders: Order[];
    filters: {
        status: string[];
        areas: string[];
        date: string;
    };
}
```

### Assignment Dashboard (/assignments)
Assignment monitoring interface with:
```typescript
type AssignmentPageProps = {
    activeAssignments: Assignment[];
    metrics: AssignmentMetrics;
    partners: {
        available: number;
        busy: number;
        offline: number;
    };
}
```

## Data Models

### Delivery Partner
```typescript
type DeliveryPartner = {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    currentLoad: number; // max: 3
    areas: string[];
    shift: {
        start: string; // HH:mm
        end: string;   // HH:mm
    };
    metrics: {
        rating: number;
        completedOrders: number;
        cancelledOrders: number;
    };
}
```

### Order
```typescript
type Order = {
    _id: string;
    orderNumber: string;
    customer: {
        name: string;
        phone: string;
        address: string;
    };
    area: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
    status: 'pending' | 'assigned' | 'picked' | 'delivered';
    scheduledFor: string; // HH:mm
    assignedTo?: string;  // partner ID
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}
```

### Assignment
```typescript
type Assignment = {
    orderId: string;
    partnerId: string;
    timestamp: Date;
    status: 'success' | 'failed';
    reason?: string;
}

type AssignmentMetrics = {
    totalAssigned: number;
    successRate: number;
    averageTime: number;
    failureReasons: {
        reason: string;
        count: number;
    }[];
}
```

## API Endpoints

### Partner Routes
- `GET /api/partners` - Retrieve all partners
- `POST /api/partners` - Create new partner
- `PUT /api/partners/[id]` - Update partner details
- `DELETE /api/partners/[id]` - Remove partner

### Order Routes
- `GET /api/orders` - Fetch all orders
- `POST /api/orders/assign` - Assign order to partner
- `PUT /api/orders/[id]/status` - Update order status

### Assignment Routes
- `GET /api/assignments/metrics` - Get assignment metrics
- `POST /api/assignments/run` - Execute assignment algorithm



