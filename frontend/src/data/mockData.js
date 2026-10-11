// Centralized CityEvent Mock Data Repository
// Initial dataset pre-populated for presentation & verification testing.
// Data is synced with localStorage to support persistent updates across sessions.

const INITIAL_USERS = [
  {
    id: "user-1",
    fullName: "Alex User",
    email: "user@cityevent.com",
    phone: "9876543210",
    city: "Mumbai",
    password: "user123", // Mock password
    role: "User",
    createdAt: "2026-09-01T10:00:00Z"
  },
  {
    id: "user-2",
    fullName: "Rohan Sharma",
    email: "rohan@gmail.com",
    phone: "9820123456",
    city: "Pune",
    password: "user123",
    role: "User",
    createdAt: "2026-09-03T14:20:00Z"
  },
  {
    id: "org-1",
    organizationName: "Tech Events Co",
    contactPersonName: "Sarah Organizer",
    email: "organizer@cityevent.com",
    phone: "9876543211",
    password: "organizer123", // Mock password
    role: "Organizer",
    createdAt: "2026-09-01T10:00:00Z"
  },
  {
    id: "org-2",
    organizationName: "Global Expo Ltd",
    contactPersonName: "Mark Director",
    email: "mark@globalexpo.com",
    phone: "9876543299",
    password: "organizer123",
    role: "Organizer",
    createdAt: "2026-09-02T10:00:00Z"
  },
  {
    id: "admin-1",
    fullName: "System Admin",
    email: "admin@cityevent.com",
    phone: "9876543212",
    password: "admin123", // Mock password
    role: "Admin",
    createdAt: "2026-09-01T10:00:00Z"
  }
];

const INITIAL_CATEGORIES = [
  { id: "cat-1", name: "Technology", description: "Hackathons, Tech Talks & Coding Workshops" },
  { id: "cat-2", name: "Music & Concerts", description: "Live Bands, DJ Nights & Musical Festivals" },
  { id: "cat-3", name: "Sports & Fitness", description: "Marathons, Tournaments & Fitness Sessions" },
  { id: "cat-4", name: "Cultural & Arts", description: "Drama, Art Exhibitions & Cultural Fests" },
  { id: "cat-5", name: "Business & Networking", description: "Startup Meetups, Expos & Seminars" },
  { id: "cat-6", name: "Unused Demo Category", description: "Category created specifically to demonstrate safe category deletion." }
];

const INITIAL_EVENTS = [
  {
    id: "event-1",
    eventName: "Mumbai Tech Summit 2026",
    description: "Annual gathering of tech innovators, AI developers, and startup founders in Mumbai.",
    category: "Technology",
    organizerId: "org-1",
    organizerName: "Tech Events Co",
    contactPerson: "Sarah Organizer",
    posterUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    city: "Mumbai",
    area: "Bandra West",
    venue: "Jio World Convention Centre",
    eventDate: "2026-10-15",
    startTime: "09:30",
    endTime: "18:00",
    entryType: "Free",
    entryFee: 0,
    paymentQrUrl: null,
    maxParticipants: 200,
    confirmedRegistrationsCount: 1,
    status: "Approved", // Pending, Approved, Rejected, Cancelled
    rejectionReason: null,
    createdAt: "2026-09-05T12:00:00Z"
  },
  {
    id: "event-2",
    eventName: "Indie Rock Night Live",
    description: "An electrifying night featuring local indie bands and live acoustic performances.",
    category: "Music & Concerts",
    organizerId: "org-1",
    organizerName: "Tech Events Co",
    contactPerson: "Sarah Organizer",
    posterUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    city: "Mumbai",
    area: "Andheri West",
    venue: "Hard Rock Cafe",
    eventDate: "2026-10-20",
    startTime: "19:00",
    endTime: "23:00",
    entryType: "Paid",
    entryFee: 499,
    paymentQrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=techevents@upi&pn=TechEventsCo",
    maxParticipants: 100,
    confirmedRegistrationsCount: 0,
    status: "Approved",
    rejectionReason: null,
    createdAt: "2026-09-06T14:30:00Z"
  },
  {
    id: "event-3",
    eventName: "AI & ML Workshop for Beginners",
    description: "Hands-on workshop covering Python AI models and machine learning basics.",
    category: "Technology",
    organizerId: "org-1",
    organizerName: "Tech Events Co",
    contactPerson: "Sarah Organizer",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    city: "Mumbai",
    area: "Powai",
    venue: "IIT Bombay Campus Auditorium",
    eventDate: "2026-11-05",
    startTime: "10:00",
    endTime: "16:00",
    entryType: "Paid",
    entryFee: 299,
    paymentQrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=techevents@upi&pn=TechEventsCo",
    maxParticipants: 50,
    confirmedRegistrationsCount: 0,
    status: "Pending", // Awaiting Admin review & approval
    rejectionReason: null,
    createdAt: "2026-09-20T09:00:00Z"
  },
  {
    id: "event-4",
    eventName: "Monsoon Half Marathon",
    description: "Cancelled due to heavy rainfall warnings. Notices sent to all registered participants.",
    category: "Sports & Fitness",
    organizerId: "org-1",
    organizerName: "Tech Events Co",
    contactPerson: "Sarah Organizer",
    posterUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80",
    city: "Mumbai",
    area: "Marine Drive",
    venue: "Promenade Start Point",
    eventDate: "2026-09-30",
    startTime: "06:00",
    endTime: "10:00",
    entryType: "Free",
    entryFee: 0,
    paymentQrUrl: null,
    maxParticipants: 500,
    confirmedRegistrationsCount: 0,
    status: "Cancelled",
    rejectionReason: null,
    createdAt: "2026-09-02T10:00:00Z"
  },
  {
    id: "event-5",
    eventName: "Exclusive Founders Masterclass",
    description: "Intimate 1-on-1 mentorship session for high-impact startup CEOs.",
    category: "Business & Networking",
    organizerId: "org-1",
    organizerName: "Tech Events Co",
    contactPerson: "Sarah Organizer",
    posterUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80",
    city: "Mumbai",
    area: "BKC",
    venue: "WeWork Financial Centre",
    eventDate: "2026-10-12",
    startTime: "14:00",
    endTime: "17:00",
    entryType: "Paid",
    entryFee: 1499,
    paymentQrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=techevents@upi&pn=TechEventsCo",
    maxParticipants: 1,
    confirmedRegistrationsCount: 1,
    status: "Approved",
    rejectionReason: null,
    createdAt: "2026-09-08T11:00:00Z"
  },
  {
    id: "event-6",
    eventName: "Digital Marketing & Branding Expo",
    description: "Rejected event test case to verify rejection reason visibility and resubmission.",
    category: "Business & Networking",
    organizerId: "org-1",
    organizerName: "Tech Events Co",
    contactPerson: "Sarah Organizer",
    posterUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
    city: "Mumbai",
    area: "Lower Parel",
    venue: "Blue Sea Banquet Hall",
    eventDate: "2026-11-15",
    startTime: "11:00",
    endTime: "17:00",
    entryType: "Free",
    entryFee: 0,
    paymentQrUrl: null,
    maxParticipants: 150,
    confirmedRegistrationsCount: 0,
    status: "Rejected",
    rejectionReason: "Venue information incomplete. Please specify building number and contact hall manager details.",
    createdAt: "2026-09-18T15:00:00Z"
  },
  {
    id: "event-7",
    eventName: "Global Fintech Summit",
    description: "Belongs to org-2 (Global Expo Ltd) for multi-organizer overview testing.",
    category: "Business & Networking",
    organizerId: "org-2",
    organizerName: "Global Expo Ltd",
    contactPerson: "Mark Director",
    posterUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
    city: "Delhi",
    area: "Pragati Maidan",
    venue: "Hall 5 Exposition Center",
    eventDate: "2026-12-01",
    startTime: "10:00",
    endTime: "18:00",
    entryType: "Free",
    entryFee: 0,
    paymentQrUrl: null,
    maxParticipants: 300,
    confirmedRegistrationsCount: 0,
    status: "Approved",
    rejectionReason: null,
    createdAt: "2026-09-12T10:00:00Z"
  }
];

const INITIAL_REGISTRATIONS = [
  {
    id: "reg-1",
    eventId: "event-1",
    eventName: "Mumbai Tech Summit 2026",
    userId: "user-1",
    participantName: "Alex User",
    email: "user@cityevent.com",
    phone: "9876543210",
    age: 22,
    gender: "Male",
    fromCity: "Mumbai",
    entryType: "Free",
    entryFee: 0,
    paymentScreenshotUrl: null,
    submissionTime: "2026-09-10T11:00:00Z",
    status: "Confirmed", // Confirmed, Pending Verification, Rejected, Cancelled
    rejectionReason: null
  },
  {
    id: "reg-2",
    eventId: "event-2",
    eventName: "Indie Rock Night Live",
    userId: "user-1",
    participantName: "Alex User",
    email: "user@cityevent.com",
    phone: "9876543210",
    age: 22,
    gender: "Male",
    fromCity: "Mumbai",
    entryType: "Paid",
    entryFee: 499,
    paymentScreenshotUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
    submissionTime: "2026-09-15T16:00:00Z",
    status: "Pending Verification",
    rejectionReason: null
  },
  {
    id: "reg-3",
    eventId: "event-5",
    eventName: "Exclusive Founders Masterclass",
    userId: "user-2",
    participantName: "Rohan Sharma",
    email: "rohan@gmail.com",
    phone: "9820123456",
    age: 28,
    gender: "Male",
    fromCity: "Pune",
    entryType: "Paid",
    entryFee: 1499,
    paymentScreenshotUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
    submissionTime: "2026-09-09T10:00:00Z",
    status: "Confirmed",
    rejectionReason: null
  }
];

// Helper to initialize and retrieve from localStorage
const getStoredData = (key, defaultData) => {
  try {
    const data = localStorage.getItem(`cityevent_${key}`);
    if (data) {
      return JSON.parse(data);
    }
    localStorage.setItem(`cityevent_${key}`, JSON.stringify(defaultData));
    return defaultData;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultData;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(`cityevent_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
};

export const getMockUsers = () => getStoredData("users", INITIAL_USERS);
export const saveMockUsers = (users) => setStoredData("users", users);

export const getMockCategories = () => getStoredData("categories", INITIAL_CATEGORIES);
export const saveMockCategories = (categories) => setStoredData("categories", categories);

export const getMockEvents = () => getStoredData("events", INITIAL_EVENTS);
export const saveMockEvents = (events) => setStoredData("events", events);

export const getMockRegistrations = () => getStoredData("registrations", INITIAL_REGISTRATIONS);
export const saveMockRegistrations = (registrations) => setStoredData("registrations", registrations);
