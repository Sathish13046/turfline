import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search, MapPin, Star, Clock, Calendar as CalendarIcon, User, LogOut, Menu, X,
  Check, ChevronRight, ChevronLeft, ChevronDown, Plus, Edit2, Trash2, Users,
  IndianRupee, TrendingUp, ShieldCheck, LayoutGrid, Filter, Car, Droplet,
  Lightbulb, Shirt, Dumbbell, Target, CircleDot, Flame, Feather, Waves, Zap,
  Trophy, AlertCircle, CheckCircle2, XCircle, LogIn, UserPlus, Building2,
  CalendarCheck, CalendarX, CircleCheck, Sparkles, RotateCcw, Wallet
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  STORAGE SHIM — makes this file runnable outside Claude's artifact  */
/*  preview (e.g. a plain Vite/VS Code setup) by backing window.storage */
/*  with localStorage when the host doesn't already provide it.         */
/* ------------------------------------------------------------------ */
if (typeof window !== "undefined" && !window.storage) {
  const NS = "turfline__";
  window.storage = {
    async get(key) {
      const raw = window.localStorage.getItem(NS + key);
      if (raw === null) throw new Error(`storage key not found: ${key}`);
      return { key, value: raw };
    },
    async set(key, value) {
      window.localStorage.setItem(NS + key, value);
      return { key, value };
    },
    async delete(key) {
      window.localStorage.removeItem(NS + key);
      return { key, deleted: true };
    },
    async list(prefix) {
      const keys = Object.keys(window.localStorage)
        .filter((k) => k.startsWith(NS + (prefix || "")))
        .map((k) => k.slice(NS.length));
      return { keys, prefix };
    },
  };
}

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                      */
/* ------------------------------------------------------------------ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

:root{
  --pitch:#122A1D;
  --pitch-2:#1D4430;
  --chalk:#F6F5EE;
  --chalk-2:#EDEBDF;
  --ink:#181712;
  --ink-soft:#565349;
  --line:#DEDACB;
  --amber:#F2A63B;
  --amber-dark:#C97F1E;
  --turf:#3F9463;
  --alert:#B3261E;
  --white:#FFFFFF;
  --radius-s:6px;
  --radius-m:10px;
  --radius-l:18px;
  --shadow-card:0 1px 2px rgba(24,23,18,0.06), 0 8px 24px -12px rgba(24,23,18,0.18);
}
*{box-sizing:border-box;}
.tl-app{
  font-family:'Inter',system-ui,sans-serif;
  background:var(--chalk);
  color:var(--ink);
  min-height:100vh;
  width:100%;
  line-height:1.5;
}
.tl-app h1,.tl-app h2,.tl-app h3,.tl-app .tl-display{
  font-family:'Oswald',system-ui,sans-serif;
  font-weight:600;
  letter-spacing:0.2px;
  margin:0;
}
.tl-mono{font-family:'Space Mono',monospace;}
.tl-app button{font-family:inherit;cursor:pointer;}
.tl-app a{color:inherit;text-decoration:none;}
.tl-app input,.tl-app select{font-family:inherit;}
.tl-container{max-width:1160px;margin:0 auto;padding:0 20px;}

/* ---------- NAV ---------- */
.tl-nav{position:sticky;top:0;z-index:40;background:var(--pitch);border-bottom:1px solid rgba(255,255,255,0.08);}
.tl-nav-row{display:flex;align-items:center;justify-content:space-between;height:66px;}
.tl-brand{display:flex;align-items:center;gap:10px;}
.tl-brand-mark{width:36px;height:36px;border-radius:8px;background:var(--amber);display:flex;align-items:center;justify-content:center;color:var(--pitch);font-family:'Oswald';font-weight:700;font-size:15px;flex-shrink:0;}
.tl-brand-name{color:var(--white);font-family:'Oswald';font-size:20px;font-weight:600;letter-spacing:0.3px;}
.tl-brand-sub{color:rgba(255,255,255,0.5);font-size:11px;margin-top:-2px;}
.tl-nav-links{display:flex;align-items:center;gap:4px;}
.tl-nav-link{color:rgba(255,255,255,0.72);padding:9px 14px;border-radius:8px;font-size:14.5px;font-weight:500;border:none;background:transparent;display:flex;align-items:center;gap:6px;}
.tl-nav-link:hover{background:rgba(255,255,255,0.08);color:var(--white);}
.tl-nav-link.active{background:rgba(255,255,255,0.12);color:var(--white);}
.tl-nav-right{display:flex;align-items:center;gap:10px;}
.tl-btn{border:none;border-radius:8px;padding:9px 16px;font-size:14.5px;font-weight:600;display:inline-flex;align-items:center;gap:7px;transition:transform .12s ease, filter .12s ease;}
.tl-btn:active{transform:scale(0.97);}
.tl-btn-amber{background:var(--amber);color:#211603;}
.tl-btn-amber:hover{filter:brightness(1.06);}
.tl-btn-ghost-light{background:rgba(255,255,255,0.1);color:var(--white);}
.tl-btn-ghost-light:hover{background:rgba(255,255,255,0.18);}
.tl-btn-dark{background:var(--pitch);color:var(--white);}
.tl-btn-dark:hover{background:var(--pitch-2);}
.tl-btn-outline{background:transparent;border:1.5px solid var(--line);color:var(--ink);}
.tl-btn-outline:hover{border-color:var(--ink);}
.tl-btn-danger{background:#FBEAE9;color:var(--alert);}
.tl-btn-danger:hover{background:#F6D8D6;}
.tl-btn:disabled{opacity:0.45;cursor:not-allowed;}
.tl-burger{display:none;background:none;border:none;color:var(--white);}

/* ---------- HERO ---------- */
.tl-hero{background:radial-gradient(ellipse at top left, var(--pitch-2), var(--pitch) 60%); position:relative; overflow:hidden; padding:64px 0 110px;}
.tl-hero:before{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(115deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 34px);pointer-events:none;}
.tl-hero-inner{position:relative;z-index:1;}
.tl-eyebrow-row{display:flex;align-items:center;gap:8px;color:var(--amber);font-size:13.5px;font-weight:600;margin-bottom:16px;}
.tl-hero h1{color:var(--white);font-size:52px;line-height:1.04;max-width:640px;}
.tl-hero p{color:rgba(255,255,255,0.68);font-size:17px;max-width:520px;margin-top:16px;}
.tl-hero-cta{display:flex;gap:12px;margin-top:28px;}
.tl-stat-strip{display:flex;gap:0;margin-top:52px;flex-wrap:wrap;}
.tl-stat{padding-right:40px;margin-right:40px;border-right:1px solid rgba(255,255,255,0.14);}
.tl-stat:last-child{border-right:none;}
.tl-stat-num{font-family:'Oswald';color:var(--amber);font-size:30px;font-weight:600;}
.tl-stat-label{color:rgba(255,255,255,0.55);font-size:12.5px;margin-top:2px;}

/* ---------- SEARCH CARD ---------- */
.tl-search-card{background:var(--white);border-radius:var(--radius-l);box-shadow:var(--shadow-card);padding:20px;margin-top:-64px;position:relative;z-index:2;display:grid;grid-template-columns:1.3fr 1fr 1fr auto;gap:12px;align-items:end;}
.tl-field label{display:block;font-size:12px;font-weight:600;color:var(--ink-soft);margin-bottom:6px;text-transform:none;}
.tl-field .tl-input-wrap{display:flex;align-items:center;gap:8px;border:1.5px solid var(--line);border-radius:8px;padding:10px 12px;background:var(--chalk);}
.tl-field input,.tl-field select{border:none;background:transparent;outline:none;width:100%;font-size:14.5px;color:var(--ink);}

/* ---------- SECTIONS ---------- */
.tl-section{padding:56px 0;}
.tl-section-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:26px;}
.tl-section-head h2{font-size:28px;}
.tl-section-head .tl-link{font-size:14px;font-weight:600;color:var(--turf);display:flex;align-items:center;gap:4px;}

.tl-sports-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;}
.tl-sport-chip{background:var(--white);border:1.5px solid var(--line);border-radius:var(--radius-m);padding:18px 10px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;transition:border-color .12s ease, transform .12s ease;}
.tl-sport-chip:hover{border-color:var(--sport-color,var(--turf));transform:translateY(-2px);}
.tl-sport-chip.active{border-color:var(--sport-color,var(--turf));background:color-mix(in srgb, var(--sport-color,var(--turf)) 8%, white);}
.tl-sport-icon-wrap{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--sport-color) 14%, white);color:var(--sport-color);}
.tl-sport-chip span{font-size:13.5px;font-weight:600;}

.tl-grounds-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.tl-ground-card{background:var(--white);border:1px solid var(--line);border-radius:var(--radius-l);overflow:hidden;display:flex;flex-direction:column;transition:transform .14s ease, box-shadow .14s ease;}
.tl-ground-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-card);}
.tl-ground-banner{height:118px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.tl-ground-banner svg{width:46px;height:46px;color:rgba(255,255,255,0.9);}
.tl-ground-banner:after{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(100deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 16px);}
.tl-ground-sport-tag{position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.28);color:white;font-size:11.5px;font-weight:600;padding:4px 10px;border-radius:20px;z-index:2;}
.tl-ground-body{padding:16px;display:flex;flex-direction:column;gap:8px;flex:1;}
.tl-ground-name{font-size:17px;font-weight:600;font-family:'Oswald';}
.tl-ground-loc{display:flex;align-items:center;gap:5px;color:var(--ink-soft);font-size:13px;}
.tl-ground-meta{display:flex;align-items:center;justify-content:space-between;margin-top:4px;}
.tl-rating{display:flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:var(--ink);}
.tl-price{font-family:'Oswald';font-size:18px;font-weight:600;color:var(--pitch);}
.tl-price span{font-family:'Inter';font-size:12px;font-weight:500;color:var(--ink-soft);}
.tl-facility-row{display:flex;gap:10px;margin-top:4px;flex-wrap:wrap;}
.tl-facility-pill{display:flex;align-items:center;gap:4px;font-size:11.5px;color:var(--ink-soft);background:var(--chalk);padding:3px 8px;border-radius:20px;}

/* ---------- FILTER LAYOUT ---------- */
.tl-grounds-layout{display:grid;grid-template-columns:250px 1fr;gap:28px;align-items:start;}
.tl-filter-panel{background:var(--white);border:1px solid var(--line);border-radius:var(--radius-m);padding:18px;position:sticky;top:86px;}
.tl-filter-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:var(--ink-soft);margin-bottom:10px;}
.tl-filter-group{margin-bottom:20px;}
.tl-checkbox-row{display:flex;align-items:center;gap:8px;padding:5px 0;font-size:14px;}
.tl-checkbox-row input{width:15px;height:15px;}

/* ---------- CARDS / BADGES ---------- */
.tl-card{background:var(--white);border:1px solid var(--line);border-radius:var(--radius-m);padding:18px;}
.tl-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600;}
.tl-badge-upcoming{background:#E7F3EB;color:#1E6B3E;}
.tl-badge-completed{background:#EAEAF3;color:#4C4C8C;}
.tl-badge-cancelled{background:#FBEAE9;color:var(--alert);}
.tl-badge-paid{background:#FFF3DE;color:var(--amber-dark);}

/* ---------- GROUND DETAIL ---------- */
.tl-detail-banner{height:220px;border-radius:var(--radius-l);position:relative;overflow:hidden;display:flex;align-items:flex-end;padding:24px;}
.tl-detail-banner:after{content:'';position:absolute;inset:0;background:linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.05));}
.tl-detail-banner-content{position:relative;z-index:1;color:white;}
.tl-detail-banner-content h1{font-size:32px;}
.tl-detail-layout{display:grid;grid-template-columns:1fr 340px;gap:28px;margin-top:24px;align-items:start;}
.tl-facility-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px;}
.tl-facility-box{display:flex;flex-direction:column;align-items:center;gap:6px;background:var(--chalk);border-radius:var(--radius-m);padding:14px 8px;text-align:center;}
.tl-facility-box span{font-size:12px;color:var(--ink-soft);font-weight:500;}
.tl-date-tabs{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;margin-top:14px;}
.tl-date-tab{flex-shrink:0;background:var(--white);border:1.5px solid var(--line);border-radius:var(--radius-m);padding:10px 14px;text-align:center;min-width:64px;}
.tl-date-tab.active{background:var(--pitch);border-color:var(--pitch);color:white;}
.tl-date-tab .d1{font-size:11px;opacity:0.7;}
.tl-date-tab .d2{font-family:'Oswald';font-size:18px;font-weight:600;}
.tl-slot-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px;}
.tl-slot{border:1.5px solid var(--line);border-radius:8px;padding:10px 6px;text-align:center;font-size:13px;font-weight:500;background:white;}
.tl-slot.selected{background:var(--turf);border-color:var(--turf);color:white;}
.tl-slot.booked{background:var(--chalk-2);color:var(--ink-soft);border-style:dashed;cursor:not-allowed;text-decoration:line-through;opacity:0.7;}
.tl-slot.available:hover{border-color:var(--turf);}
.tl-summary-card{position:sticky;top:86px;}
.tl-summary-row{display:flex;justify-content:space-between;font-size:14px;padding:7px 0;color:var(--ink-soft);}
.tl-summary-row.total{color:var(--ink);font-weight:700;font-size:16px;border-top:1px solid var(--line);margin-top:6px;padding-top:12px;}

/* ---------- MODAL ---------- */
.tl-overlay{position:fixed;inset:0;background:rgba(18,42,29,0.55);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;}
.tl-modal{background:white;border-radius:var(--radius-l);max-width:440px;width:100%;padding:28px;position:relative;max-height:90vh;overflow-y:auto;}
.tl-modal-close{position:absolute;top:16px;right:16px;background:var(--chalk);border:none;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;}
.tl-form-row{margin-bottom:14px;}
.tl-form-row label{display:block;font-size:13px;font-weight:600;margin-bottom:6px;}
.tl-form-row input,.tl-form-row select,.tl-form-row textarea{width:100%;border:1.5px solid var(--line);border-radius:8px;padding:10px 12px;font-size:14.5px;outline:none;}
.tl-form-row input:focus,.tl-form-row select:focus,.tl-form-row textarea:focus{border-color:var(--turf);}
.tl-tabs-row{display:flex;background:var(--chalk);border-radius:8px;padding:4px;margin-bottom:18px;}
.tl-tab-btn{flex:1;border:none;background:transparent;padding:8px;border-radius:6px;font-size:13.5px;font-weight:600;color:var(--ink-soft);}
.tl-tab-btn.active{background:white;color:var(--ink);box-shadow:0 1px 2px rgba(0,0,0,0.08);}

/* ---------- TOAST ---------- */
.tl-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:200;background:var(--ink);color:white;padding:12px 20px;border-radius:10px;font-size:14px;display:flex;align-items:center;gap:8px;box-shadow:0 8px 24px rgba(0,0,0,0.3);}
.tl-toast.error{background:var(--alert);}
.tl-toast.success{background:#1E6B3E;}

/* ---------- ADMIN ---------- */
.tl-admin-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.tl-stat-card{background:white;border:1px solid var(--line);border-radius:var(--radius-m);padding:18px;}
.tl-stat-card .num{font-family:'Oswald';font-size:26px;font-weight:600;}
.tl-stat-card .lbl{font-size:12.5px;color:var(--ink-soft);margin-top:2px;}
.tl-table{width:100%;border-collapse:collapse;font-size:13.5px;}
.tl-table th{text-align:left;color:var(--ink-soft);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.4px;padding:10px 12px;border-bottom:1.5px solid var(--line);}
.tl-table td{padding:11px 12px;border-bottom:1px solid var(--line);vertical-align:middle;}
.tl-icon-btn{border:none;background:var(--chalk);width:30px;height:30px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;}
.tl-icon-btn:hover{background:var(--chalk-2);}
.tl-empty{text-align:center;padding:60px 20px;color:var(--ink-soft);}
.tl-empty svg{margin-bottom:12px;color:var(--line);}

/* ---------- MISC ---------- */
.tl-footer{background:var(--pitch);color:rgba(255,255,255,0.55);padding:32px 0;font-size:13px;text-align:center;margin-top:40px;}
.tl-page-title{font-size:30px;margin-bottom:6px;}
.tl-page-sub{color:var(--ink-soft);font-size:14.5px;margin-bottom:26px;}
.tl-auth-toggle{display:flex;gap:6px;margin-bottom:18px;}
.tl-demo-hint{background:#FFF7E8;border:1px dashed var(--amber-dark);border-radius:8px;padding:10px 12px;font-size:12.5px;color:var(--amber-dark);margin-bottom:16px;}

@media (max-width: 860px){
  .tl-nav-links{display:none;}
  .tl-burger{display:flex;}
  .tl-hero h1{font-size:34px;}
  .tl-search-card{grid-template-columns:1fr;margin-top:16px;}
  .tl-sports-grid{grid-template-columns:repeat(3,1fr);}
  .tl-grounds-grid{grid-template-columns:repeat(1,1fr);}
  .tl-grounds-layout{grid-template-columns:1fr;}
  .tl-filter-panel{position:static;}
  .tl-detail-layout{grid-template-columns:1fr;}
  .tl-facility-grid{grid-template-columns:repeat(2,1fr);}
  .tl-slot-grid{grid-template-columns:repeat(2,1fr);}
  .tl-admin-grid{grid-template-columns:repeat(2,1fr);}
  .tl-stat-strip{gap:24px;}
  .tl-stat{padding-right:0;margin-right:0;border-right:none;}
}
`;

/* ------------------------------------------------------------------ */
/*  STATIC DATA                                                        */
/* ------------------------------------------------------------------ */
const SPORTS = [
  { id: "cricket", name: "Cricket", icon: Target, color: "#C97F1E" },
  { id: "football", name: "Football", icon: CircleDot, color: "#2F8F4E" },
  { id: "basketball", name: "Basketball", icon: Flame, color: "#B85C1E" },
  { id: "badminton", name: "Badminton", icon: Feather, color: "#7A5CC2" },
  { id: "volleyball", name: "Volleyball", icon: Waves, color: "#1F8A82" },
  { id: "tennis", name: "Tennis", icon: Zap, color: "#6C9A1D" },
];
const sportById = (id) => SPORTS.find((s) => s.id === id);

const FACILITY_META = {
  parking: { label: "Parking", icon: Car },
  changing_room: { label: "Changing Rooms", icon: Shirt },
  lighting: { label: "Floodlights", icon: Lightbulb },
  water: { label: "Drinking Water", icon: Droplet },
  equipment: { label: "Equipment Rental", icon: Dumbbell },
  washroom: { label: "Washrooms", icon: Sparkles },
};

const SEED_GROUNDS = [
  { id: "g1", name: "Turf Arena RS Puram", city: "Coimbatore", area: "RS Puram", sport: "football", price: 1200, rating: 4.6, facilities: ["parking", "lighting", "water", "washroom"], desc: "A full-size 5-a-side turf with premium synthetic grass and night floodlighting, popular with weekend leagues." },
  { id: "g2", name: "Peelamedu Cricket Nets", city: "Coimbatore", area: "Peelamedu", sport: "cricket", price: 900, rating: 4.4, facilities: ["parking", "equipment", "water"], desc: "Practice nets and a matting pitch ideal for team net sessions and coaching camps." },
  { id: "g3", name: "Race Course Badminton Court", city: "Coimbatore", area: "Race Course", sport: "badminton", price: 400, rating: 4.7, facilities: ["changing_room", "equipment", "water", "lighting"], desc: "Wooden-floor indoor badminton courts with BWF-marked lines and rental rackets available." },
  { id: "g4", name: "Gandhipuram Hoops Court", city: "Coimbatore", area: "Gandhipuram", sport: "basketball", price: 600, rating: 4.2, facilities: ["lighting", "parking", "water"], desc: "Outdoor acrylic-surface half court, floodlit for evening games." },
  { id: "g5", name: "Anna Nagar Smash Club", city: "Chennai", area: "Anna Nagar", sport: "tennis", price: 800, rating: 4.5, facilities: ["parking", "changing_room", "water", "equipment"], desc: "Clay courts maintained daily, with ball-boys available on request for tournaments." },
  { id: "g6", name: "Besant Nagar Beach Volleyball", city: "Chennai", area: "Besant Nagar", sport: "volleyball", price: 500, rating: 4.3, facilities: ["water", "washroom"], desc: "Sand court a short walk from the beach, best played in the evening breeze." },
  { id: "g7", name: "Koramangala Kickabout Turf", city: "Bengaluru", area: "Koramangala", sport: "football", price: 1500, rating: 4.8, facilities: ["parking", "lighting", "changing_room", "water", "washroom"], desc: "The city's top-rated turf, hosting corporate leagues most weeknights." },
  { id: "g8", name: "Indiranagar Cricket Box", city: "Bengaluru", area: "Indiranagar", sport: "cricket", price: 1100, rating: 4.5, facilities: ["parking", "equipment", "lighting"], desc: "Box cricket cage with automated bowling machine slots on request." },
  { id: "g9", name: "Banjara Hills Court Club", city: "Hyderabad", area: "Banjara Hills", sport: "badminton", price: 450, rating: 4.6, facilities: ["changing_room", "water", "equipment", "parking"], desc: "Four synthetic courts with air-conditioning, popular for evening corporate matches." },
  { id: "g10", name: "Baner Rally Point", city: "Pune", area: "Baner", sport: "tennis", price: 750, rating: 4.1, facilities: ["parking", "water", "lighting"], desc: "Hard courts with practice walls, good for solo drilling sessions." },
];

const DEMO_USER = { id: "u-demo", name: "Arjun Kumar", email: "arjun@example.com", phone: "9876543210", password: "demo123" };
const ADMIN_CRED = { email: "admin@turfline.app", password: "admin123", name: "Admin" };

/* Full list of districts/cities TurfLine covers for search purposes.
   Grounds currently exist only in a handful of these (see SEED_GROUNDS) —
   the rest are shown so users can see where the platform is expanding to. */
const ALL_DISTRICTS = [
  "Ariyalur", "Bengaluru", "Bengaluru Rural", "Chengalpattu", "Chennai", "Chittoor",
  "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Faridabad",
  "Gautam Buddh Nagar", "Ghaziabad", "Guntur", "Gurugram", "Hyderabad", "Indore",
  "Jaipur", "Kancheepuram", "Kanniyakumari", "Karimnagar", "Karur", "Khammam",
  "Kolkata", "Krishnagiri", "Lucknow", "Madurai", "Mumbai", "Mumbai Suburban",
  "Mysuru", "Nagapattinam", "Namakkal", "Nashik", "Navi Mumbai", "New Delhi",
  "Nilgiris", "Perambalur", "Pune", "Pudukkottai", "Ramanathapuram", "Rangareddy",
  "Salem", "Sivaganga", "Surat", "Thane", "Thanjavur", "Theni",
  "Thiruvallur", "Thiruvarur", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvannamalai", "Vadodara", "Vellore",
  "Vijayawada", "Villupuram", "Virudhunagar", "Visakhapatnam", "Warangal",
].sort();

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function isoDate(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function next7Days() {
  const out = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      iso: isoDate(d),
      dow: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: d.getDate(),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return out;
}
function hourLabel(h) {
  const period = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:00 ${period}`;
}
const SLOT_HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6..21
function slotKey(groundId, date, hour) { return `${groundId}__${date}__${hour}`; }
function genId(prefix) {
  return `${prefix}${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).toUpperCase().slice(2, 5)}`;
}
function fmtMoney(n) { return `₹${n.toLocaleString("en-IN")}`; }
function fmtDateLong(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
function bookingStartsAt(booking) {
  const firstHour = Math.min(...booking.slots);
  return new Date(`${booking.date}T${pad(firstHour)}:00:00`);
}
function computeStatus(booking) {
  if (booking.status === "cancelled") return "cancelled";
  const lastHour = Math.max(...booking.slots);
  const end = new Date(`${booking.date}T${pad(lastHour + 1)}:00:00`);
  return end.getTime() < Date.now() ? "completed" : "upcoming";
}
function canCancel(booking) {
  if (computeStatus(booking) !== "upcoming") return false;
  const start = bookingStartsAt(booking);
  return start.getTime() - Date.now() > 3 * 60 * 60 * 1000; // 3hr rule
}

function withTimeout(promise, ms = 4000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("storage timed out")), ms)),
  ]);
}
async function safeGet(key, shared, fallback) {
  try {
    const res = await withTimeout(window.storage.get(key, shared));
    return res ? JSON.parse(res.value) : fallback;
  } catch (e) {
    return fallback;
  }
}
async function safeSet(key, shared, value) {
  try {
    await withTimeout(window.storage.set(key, JSON.stringify(value), shared));
    return true;
  } catch (e) {
    return false;
  }
}

/* seed a deterministic handful of "already booked" slots so the demo
   feels alive on first load */
function seedBookedBookings(grounds) {
  const bookings = [];
  const today = next7Days()[0].iso;
  const tomorrow = next7Days()[1].iso;
  const patterns = [
    [today, [9, 10, 18]],
    [today, [19]],
    [tomorrow, [7, 8]],
    [tomorrow, [20, 21]],
  ];
  grounds.slice(0, 6).forEach((g, idx) => {
    const [date, hours] = patterns[idx % patterns.length];
    bookings.push({
      id: genId("BKG"),
      userId: DEMO_USER.id,
      userName: DEMO_USER.name,
      groundId: g.id,
      groundName: g.name,
      city: g.city,
      sport: g.sport,
      date,
      slots: hours,
      pricePerHour: g.price,
      total: hours.length * g.price,
      status: "confirmed",
      paymentId: genId("PAY"),
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
    });
  });
  // one already-completed booking for the demo user, and one cancelled
  const past = next7Days()[0].iso;
  const oldGround = grounds[7];
  bookings.push({
    id: genId("BKG"),
    userId: DEMO_USER.id,
    userName: DEMO_USER.name,
    groundId: oldGround.id,
    groundName: oldGround.name,
    city: oldGround.city,
    sport: oldGround.sport,
    date: isoDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)),
    slots: [17],
    pricePerHour: oldGround.price,
    total: oldGround.price,
    status: "confirmed",
    paymentId: genId("PAY"),
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  });
  const cancelGround = grounds[2];
  bookings.push({
    id: genId("BKG"),
    userId: DEMO_USER.id,
    userName: DEMO_USER.name,
    groundId: cancelGround.id,
    groundName: cancelGround.name,
    city: cancelGround.city,
    sport: cancelGround.sport,
    date: next7Days()[3].iso,
    slots: [12],
    pricePerHour: cancelGround.price,
    total: cancelGround.price,
    status: "cancelled",
    paymentId: genId("PAY"),
    createdAt: Date.now() - 1000 * 60 * 60 * 10,
  });
  return bookings;
}

/* ------------------------------------------------------------------ */
/*  SMALL SHARED COMPONENTS                                            */
/* ------------------------------------------------------------------ */
function SportIcon({ sport, size = 22 }) {
  const s = sportById(sport);
  if (!s) return null;
  const Icon = s.icon;
  return <Icon size={size} style={{ color: s.color }} />;
}

function GroundCard({ ground, onOpen }) {
  const s = sportById(ground.sport);
  const Icon = s.icon;
  return (
    <div className="tl-ground-card" onClick={() => onOpen(ground.id)} style={{ cursor: "pointer" }}>
      <div className="tl-ground-banner" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}CC)` }}>
        <span className="tl-ground-sport-tag">{s.name}</span>
        <Icon size={44} color="rgba(255,255,255,0.92)" />
      </div>
      <div className="tl-ground-body">
        <div className="tl-ground-name">{ground.name}</div>
        <div className="tl-ground-loc"><MapPin size={13} /> {ground.area}, {ground.city}</div>
        <div className="tl-facility-row">
          {ground.facilities.slice(0, 3).map((f) => {
            const meta = FACILITY_META[f];
            const FIcon = meta.icon;
            return <span key={f} className="tl-facility-pill"><FIcon size={12} /> {meta.label}</span>;
          })}
        </div>
        <div className="tl-ground-meta">
          <div className="tl-rating"><Star size={14} fill="#F2A63B" color="#F2A63B" /> {ground.rating}</div>
          <div className="tl-price">{fmtMoney(ground.price)}<span> /hr</span></div>
        </div>
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const Icon = toast.type === "error" ? XCircle : CheckCircle2;
  return (
    <div className={`tl-toast ${toast.type}`}>
      <Icon size={17} /> {toast.message}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN APP                                                           */
/* ------------------------------------------------------------------ */
export default function App() {
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState("home"); // home | grounds | detail | bookings | profile | admin
  const [selectedGroundId, setSelectedGroundId] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [grounds, setGrounds] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [session, setSession] = useState(null); // { type: 'user'|'admin', id }

  const [authOpen, setAuthOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // home search state
  const [searchLocation, setSearchLocation] = useState("");
  const [searchSport, setSearchSport] = useState("");

  // grounds page filters
  const [filterSports, setFilterSports] = useState([]);
  const [filterCity, setFilterCity] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState(2000);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    (async () => {
      let g = await safeGet("tl_grounds", true, null);
      if (!g) {
        g = SEED_GROUNDS;
        await safeSet("tl_grounds", true, g);
      }
      let u = await safeGet("tl_users", true, null);
      if (!u) {
        u = [DEMO_USER];
        await safeSet("tl_users", true, u);
      }
      let b = await safeGet("tl_bookings", true, null);
      if (!b) {
        b = seedBookedBookings(g);
        await safeSet("tl_bookings", true, b);
      }
      const s = await safeGet("tl_session", false, null);
      setGrounds(g);
      setUsers(u);
      setBookings(b);
      setSession(s);
      setReady(true);
    })();
  }, []);

  const persistGrounds = useCallback(async (next) => {
    setGrounds(next);
    await safeSet("tl_grounds", true, next);
  }, []);
  const persistUsers = useCallback(async (next) => {
    setUsers(next);
    await safeSet("tl_users", true, next);
  }, []);
  const persistBookings = useCallback(async (next) => {
    setBookings(next);
    await safeSet("tl_bookings", true, next);
  }, []);
  const persistSession = useCallback(async (next) => {
    setSession(next);
    await safeSet("tl_session", false, next);
  }, []);

  const currentUser = useMemo(() => {
    if (!session || session.type !== "user") return null;
    return users.find((u) => u.id === session.id) || null;
  }, [session, users]);

  const isAdmin = session?.type === "admin";

  /* ---------------- BOOKED SLOTS LOOKUP ---------------- */
  const bookedSet = useMemo(() => {
    const set = new Set();
    bookings.forEach((b) => {
      if (b.status === "cancelled") return;
      b.slots.forEach((h) => set.add(slotKey(b.groundId, b.date, h)));
    });
    return set;
  }, [bookings]);

  /* ---------------- NAVIGATION HELPERS ---------------- */
  function go(p) { setPage(p); setMobileMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function openGround(id) { setSelectedGroundId(id); go("detail"); }
  function requireAuth(next) {
    if (!currentUser) { setAuthOpen(true); return false; }
    return true;
  }

  /* ---------------- AUTH ACTIONS ---------------- */
  function handleRegister({ name, email, phone, password }) {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      showToast("An account with this email already exists.", "error");
      return false;
    }
    const newUser = { id: genId("U"), name, email, phone, password };
    // Update UI state immediately; persist in the background so a slow
    // or unavailable storage backend never blocks the login experience.
    persistUsers([...users, newUser]);
    persistSession({ type: "user", id: newUser.id });
    showToast(`Welcome, ${name.split(" ")[0]}! Your account is ready.`);
    setAuthOpen(false);
    return true;
  }
  function handleLogin({ email, password }) {
    if (email.toLowerCase() === ADMIN_CRED.email && password === ADMIN_CRED.password) {
      persistSession({ type: "admin", id: "admin" });
      showToast("Welcome back, Admin.");
      setAuthOpen(false);
      go("admin");
      return true;
    }
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) { showToast("Incorrect email or password.", "error"); return false; }
    persistSession({ type: "user", id: found.id });
    showToast(`Welcome back, ${found.name.split(" ")[0]}!`);
    setAuthOpen(false);
    return true;
  }
  function handleLogout() {
    persistSession(null);
    showToast("You've been logged out.");
    go("home");
  }

  /* ---------------- BOOKING ACTIONS ---------------- */
  function createBooking({ ground, date, slots }) {
    const conflict = slots.some((h) => bookedSet.has(slotKey(ground.id, date, h)));
    if (conflict) {
      showToast("Sorry, this time slot is already booked. Please select another time.", "error");
      return null;
    }
    const booking = {
      id: genId("BKG"),
      userId: currentUser.id,
      userName: currentUser.name,
      groundId: ground.id,
      groundName: ground.name,
      city: ground.city,
      sport: ground.sport,
      date,
      slots: [...slots].sort((a, b) => a - b),
      pricePerHour: ground.price,
      total: slots.length * ground.price,
      status: "confirmed",
      paymentId: genId("PAY"),
      createdAt: Date.now(),
    };
    persistBookings([...bookings, booking]);
    return booking;
  }
  function cancelBooking(bookingId) {
    const next = bookings.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b));
    persistBookings(next);
    showToast("Booking cancelled. Refund will reflect within 3-5 days.");
  }

  /* ---------------- ADMIN: GROUNDS CRUD ---------------- */
  function upsertGround(ground) {
    if (ground.id) {
      persistGrounds(grounds.map((g) => (g.id === ground.id ? ground : g)));
    } else {
      persistGrounds([...grounds, { ...ground, id: genId("G") }]);
    }
  }
  function deleteGround(id) {
    persistGrounds(grounds.filter((g) => g.id !== id));
    showToast("Ground removed.");
  }
  function adminSetBookingStatus(id, status) {
    persistBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
  }
  function resetDemoData() {
    const g = SEED_GROUNDS;
    const u = [DEMO_USER];
    const b = seedBookedBookings(g);
    persistGrounds(g);
    persistUsers(u);
    persistBookings(b);
    showToast("Demo data has been reset.");
  }

  if (!ready) {
    return (
      <div className="tl-app" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <style>{CSS}</style>
        <div style={{ textAlign: "center", color: "var(--ink-soft)" }}>
          <Trophy size={28} style={{ marginBottom: 8 }} />
          <div>Loading TurfLine…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="tl-app">
      <style>{CSS}</style>

      <Navbar
        page={page} go={go} currentUser={currentUser} isAdmin={isAdmin}
        onLogout={handleLogout} onLoginClick={() => setAuthOpen(true)}
        mobileMenu={mobileMenu} setMobileMenu={setMobileMenu}
      />

      {page === "home" && (
        <Home
          grounds={grounds}
          searchLocation={searchLocation} setSearchLocation={setSearchLocation}
          searchSport={searchSport} setSearchSport={setSearchSport}
          onOpenGround={openGround}
          onSearch={() => { setFilterCity(searchLocation); setFilterSports(searchSport ? [searchSport] : []); go("grounds"); }}
          onPickSport={(id) => { setFilterSports([id]); setFilterCity(""); go("grounds"); }}
          goGrounds={() => go("grounds")}
        />
      )}

      {page === "grounds" && (
        <GroundsPage
          grounds={grounds}
          filterSports={filterSports} setFilterSports={setFilterSports}
          filterCity={filterCity} setFilterCity={setFilterCity}
          filterMaxPrice={filterMaxPrice} setFilterMaxPrice={setFilterMaxPrice}
          onOpenGround={openGround}
        />
      )}

      {page === "detail" && (
        <GroundDetail
          ground={grounds.find((g) => g.id === selectedGroundId)}
          bookedSet={bookedSet}
          currentUser={currentUser}
          onRequireAuth={() => setAuthOpen(true)}
          onBook={createBooking}
          onBooked={() => go("bookings")}
          back={() => go("grounds")}
        />
      )}

      {page === "bookings" && (
        currentUser ? (
          <MyBookings bookings={bookings.filter((b) => b.userId === currentUser.id)} onCancel={cancelBooking} onBrowse={() => go("grounds")} />
        ) : <LoggedOutPanel onLogin={() => setAuthOpen(true)} message="Log in to view and manage your bookings." />
      )}

      {page === "profile" && (
        currentUser ? (
          <Profile user={currentUser} bookings={bookings.filter((b) => b.userId === currentUser.id)} onLogout={handleLogout} onUpdate={(u) => persistUsers(users.map((x) => (x.id === u.id ? u : x)))} />
        ) : <LoggedOutPanel onLogin={() => setAuthOpen(true)} message="Log in to view your profile." />
      )}

      {page === "admin" && (
        isAdmin ? (
          <AdminDashboard
            grounds={grounds} users={users} bookings={bookings}
            onUpsertGround={upsertGround} onDeleteGround={deleteGround}
            onSetBookingStatus={adminSetBookingStatus}
            onReset={resetDemoData}
          />
        ) : <LoggedOutPanel onLogin={() => setAuthOpen(true)} message="Admin login required to view this dashboard." />
      )}

      <footer className="tl-footer">
        <div className="tl-container">TurfLine — Online Sports Ground Booking System · Built as a demo project · Sample data only</div>
      </footer>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onLogin={handleLogin} onRegister={handleRegister} />}
      <Toast toast={toast} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NAVBAR                                                             */
/* ------------------------------------------------------------------ */
function Navbar({ page, go, currentUser, isAdmin, onLogout, onLoginClick, mobileMenu, setMobileMenu }) {
  const links = [
    { id: "home", label: "Home" },
    { id: "grounds", label: "Grounds" },
    { id: "bookings", label: "My Bookings" },
  ];
  return (
    <div className="tl-nav">
      <div className="tl-container tl-nav-row">
        <div className="tl-brand" onClick={() => go("home")} style={{ cursor: "pointer" }}>
          <div className="tl-brand-mark">TL</div>
          <div>
            <div className="tl-brand-name">TurfLine</div>
            <div className="tl-brand-sub">Book a ground in minutes</div>
          </div>
        </div>
        <div className="tl-nav-links">
          {links.map((l) => (
            <button key={l.id} className={`tl-nav-link ${page === l.id ? "active" : ""}`} onClick={() => go(l.id)}>{l.label}</button>
          ))}
          {isAdmin && <button className={`tl-nav-link ${page === "admin" ? "active" : ""}`} onClick={() => go("admin")}>Admin</button>}
        </div>
        <div className="tl-nav-right">
          {currentUser ? (
            <>
              <button className="tl-nav-link" onClick={() => go("profile")}><User size={16} /> {currentUser.name.split(" ")[0]}</button>
              <button className="tl-btn tl-btn-ghost-light" onClick={onLogout}><LogOut size={15} /> Logout</button>
            </>
          ) : isAdmin ? (
            <button className="tl-btn tl-btn-ghost-light" onClick={onLogout}><LogOut size={15} /> Admin logout</button>
          ) : (
            <button className="tl-btn tl-btn-amber" onClick={onLoginClick}><LogIn size={15} /> Login</button>
          )}
          <button className="tl-burger" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {mobileMenu && (
        <div className="tl-container" style={{ paddingBottom: 14, display: "flex", flexDirection: "column", gap: 4 }}>
          {[...links, ...(isAdmin ? [{ id: "admin", label: "Admin" }] : []), { id: "profile", label: "Profile" }].map((l) => (
            <button key={l.id} className={`tl-nav-link ${page === l.id ? "active" : ""}`} onClick={() => go(l.id)} style={{ justifyContent: "flex-start" }}>{l.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HOME PAGE                                                          */
/* ------------------------------------------------------------------ */
function Home({ grounds, searchLocation, setSearchLocation, searchSport, setSearchSport, onOpenGround, onSearch, onPickSport, goGrounds }) {
  const cities = [...new Set(grounds.map((g) => g.city))];
  const activeDistricts = new Set(cities);
  const popular = [...grounds].sort((a, b) => b.rating - a.rating).slice(0, 6);
  return (
    <>
      <div className="tl-hero">
        <div className="tl-container tl-hero-inner">
          <div className="tl-eyebrow-row"><Sparkles size={15} /> {grounds.length} grounds ready to book across {cities.length} cities</div>
          <h1>Find a ground.<br />Lock a slot.<br />Just play.</h1>
          <p>Search turfs, courts and nets near you, see real-time slot availability, and confirm your booking in under a minute.</p>
          <div className="tl-stat-strip">
            <div className="tl-stat"><div className="tl-stat-num">{grounds.length}</div><div className="tl-stat-label">Grounds listed</div></div>
            <div className="tl-stat"><div className="tl-stat-num">{cities.length}</div><div className="tl-stat-label">Cities covered</div></div>
            <div className="tl-stat"><div className="tl-stat-num">{SPORTS.length}</div><div className="tl-stat-label">Sports supported</div></div>
            <div className="tl-stat"><div className="tl-stat-num">4.5★</div><div className="tl-stat-label">Avg. ground rating</div></div>
          </div>
        </div>
      </div>

      <div className="tl-container">
        <div className="tl-search-card">
          <div className="tl-field">
            <label>Location</label>
            <div className="tl-input-wrap">
              <MapPin size={16} color="#565349" />
              <input list="tl-cities" placeholder="Search district or area" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
              <datalist id="tl-cities">{ALL_DISTRICTS.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 5 }}>
              {activeDistricts.size} of {ALL_DISTRICTS.length} districts currently have grounds listed
            </div>
          </div>
          <div className="tl-field">
            <label>Sport</label>
            <div className="tl-input-wrap">
              <Filter size={16} color="#565349" />
              <select value={searchSport} onChange={(e) => setSearchSport(e.target.value)}>
                <option value="">Any sport</option>
                {SPORTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="tl-field">
            <label>&nbsp;</label>
            <div className="tl-input-wrap"><Clock size={16} color="#565349" /><span style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>Any date</span></div>
          </div>
          <button className="tl-btn tl-btn-dark" style={{ height: 42, padding: "0 20px" }} onClick={onSearch}><Search size={16} /> Search grounds</button>
        </div>
      </div>

      <div className="tl-container">
        <div className="tl-section">
          <div className="tl-section-head"><h2>Browse by sport</h2></div>
          <div className="tl-sports-grid">
            {SPORTS.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.id} className="tl-sport-chip" style={{ "--sport-color": s.color }} onClick={() => onPickSport(s.id)}>
                  <div className="tl-sport-icon-wrap" style={{ "--sport-color": s.color }}><Icon size={20} /></div>
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="tl-section" style={{ paddingTop: 0 }}>
          <div className="tl-section-head">
            <h2>Popular near you</h2>
            <button className="tl-link" style={{ background: "none", border: "none" }} onClick={goGrounds}>View all grounds <ChevronRight size={15} /></button>
          </div>
          <div className="tl-grounds-grid">
            {popular.map((g) => <GroundCard key={g.id} ground={g} onOpen={onOpenGround} />)}
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  GROUNDS LISTING PAGE                                               */
/* ------------------------------------------------------------------ */
function GroundsPage({ grounds, filterSports, setFilterSports, filterCity, setFilterCity, filterMaxPrice, setFilterMaxPrice, onOpenGround }) {
  const activeCities = new Set(grounds.map((g) => g.city));
  function toggleSport(id) {
    setFilterSports(filterSports.includes(id) ? filterSports.filter((s) => s !== id) : [...filterSports, id]);
  }
  const filtered = grounds.filter((g) => {
    if (filterSports.length && !filterSports.includes(g.sport)) return false;
    if (filterCity && g.city !== filterCity) return false;
    if (g.price > filterMaxPrice) return false;
    return true;
  });
  return (
    <div className="tl-container">
      <div className="tl-section" style={{ paddingBottom: 70 }}>
        <h1 className="tl-page-title">Sports grounds</h1>
        <p className="tl-page-sub">{filtered.length} of {grounds.length} grounds match your filters</p>
        <div className="tl-grounds-layout">
          <div className="tl-filter-panel">
            <div className="tl-filter-group">
              <div className="tl-filter-title">Sport</div>
              {SPORTS.map((s) => (
                <label className="tl-checkbox-row" key={s.id}>
                  <input type="checkbox" checked={filterSports.includes(s.id)} onChange={() => toggleSport(s.id)} /> {s.name}
                </label>
              ))}
            </div>
            <div className="tl-filter-group">
              <div className="tl-filter-title">District</div>
              <select className="tl-form-row" style={{ width: "100%", border: "1.5px solid var(--line)", borderRadius: 8, padding: "8px 10px" }} value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                <option value="">All districts</option>
                {ALL_DISTRICTS.map((c) => (
                  <option key={c} value={c}>{c}{activeCities.has(c) ? "" : " (no grounds yet)"}</option>
                ))}
              </select>
            </div>
            <div className="tl-filter-group">
              <div className="tl-filter-title">Max price / hr: {fmtMoney(filterMaxPrice)}</div>
              <input type="range" min="300" max="2000" step="50" value={filterMaxPrice} onChange={(e) => setFilterMaxPrice(Number(e.target.value))} style={{ width: "100%" }} />
            </div>
            <button className="tl-btn tl-btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => { setFilterSports([]); setFilterCity(""); setFilterMaxPrice(2000); }}>
              <RotateCcw size={14} /> Clear filters
            </button>
          </div>
          <div>
            {filtered.length ? (
              <div className="tl-grounds-grid">
                {filtered.map((g) => <GroundCard key={g.id} ground={g} onOpen={onOpenGround} />)}
              </div>
            ) : (
              <div className="tl-empty"><Filter size={34} /><div>No grounds match these filters. Try widening your search.</div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GROUND DETAIL + BOOKING                                            */
/* ------------------------------------------------------------------ */
function GroundDetail({ ground, bookedSet, currentUser, onRequireAuth, onBook, onBooked, back }) {
  const dates = useMemo(() => next7Days(), []);
  const [date, setDate] = useState(dates[0].iso);
  const [selected, setSelected] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => { setSelected([]); }, [date, ground?.id]);

  if (!ground) {
    return <div className="tl-container"><div className="tl-empty"><AlertCircle size={30} /><div>Ground not found.</div><button className="tl-btn tl-btn-outline" style={{ marginTop: 14 }} onClick={back}>Back to grounds</button></div></div>;
  }
  const s = sportById(ground.sport);

  function toggleSlot(h) {
    const key = slotKey(ground.id, date, h);
    if (bookedSet.has(key)) return;
    setSelected((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h].sort((a, b) => a - b)));
  }

  function handleBookClick() {
    if (!selected.length) return;
    if (!currentUser) { onRequireAuth(); return; }
    setConfirmOpen(true);
  }

  async function confirmBooking() {
    const booking = await onBook({ ground, date, slots: selected });
    if (booking) {
      setResult(booking);
      setConfirmOpen(false);
    } else {
      setConfirmOpen(false);
      setSelected([]);
    }
  }

  const total = selected.length * ground.price;

  return (
    <div className="tl-container">
      <div className="tl-section">
        <button className="tl-btn tl-btn-outline" style={{ marginBottom: 18 }} onClick={back}><ChevronLeft size={15} /> Back to grounds</button>

        <div className="tl-detail-banner" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}CC)` }}>
          <div className="tl-detail-banner-content">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="tl-ground-sport-tag" style={{ position: "static" }}>{s.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13.5 }}><Star size={14} fill="#F2A63B" color="#F2A63B" /> {ground.rating}</div>
            </div>
            <h1>{ground.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, opacity: 0.9 }}><MapPin size={14} /> {ground.area}, {ground.city}</div>
          </div>
        </div>

        <div className="tl-detail-layout">
          <div>
            <p style={{ color: "var(--ink-soft)", fontSize: 15, marginTop: 20 }}>{ground.desc}</p>

            <h3 style={{ fontSize: 18, marginTop: 24 }}>Facilities</h3>
            <div className="tl-facility-grid">
              {ground.facilities.map((f) => {
                const meta = FACILITY_META[f];
                const FIcon = meta.icon;
                return (
                  <div className="tl-facility-box" key={f}><FIcon size={20} color="var(--turf)" /><span>{meta.label}</span></div>
                );
              })}
            </div>

            <h3 style={{ fontSize: 18, marginTop: 28 }}>Choose a date</h3>
            <div className="tl-date-tabs">
              {dates.map((d) => (
                <button key={d.iso} className={`tl-date-tab ${date === d.iso ? "active" : ""}`} onClick={() => setDate(d.iso)}>
                  <div className="d1">{d.label === "Today" || d.label === "Tomorrow" ? d.label : d.dow}</div>
                  <div className="d2">{d.day}</div>
                </button>
              ))}
            </div>

            <h3 style={{ fontSize: 18, marginTop: 24 }}>Available time slots</h3>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>Tap a slot to select it. Booked slots are greyed out.</p>
            <div className="tl-slot-grid">
              {SLOT_HOURS.map((h) => {
                const key = slotKey(ground.id, date, h);
                const isBooked = bookedSet.has(key);
                const isSelected = selected.includes(h);
                return (
                  <button
                    key={h}
                    className={`tl-slot ${isBooked ? "booked" : isSelected ? "selected" : "available"}`}
                    onClick={() => toggleSlot(h)}
                    disabled={isBooked}
                  >
                    {hourLabel(h)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="tl-card tl-summary-card">
            <h3 style={{ fontSize: 17 }}>Booking summary</h3>
            <div className="tl-summary-row"><span>Ground</span><span>{ground.name}</span></div>
            <div className="tl-summary-row"><span>Date</span><span>{fmtDateLong(date)}</span></div>
            <div className="tl-summary-row"><span>Slots selected</span><span>{selected.length ? selected.map((h) => hourLabel(h)).join(", ") : "None"}</span></div>
            <div className="tl-summary-row"><span>Price / hour</span><span>{fmtMoney(ground.price)}</span></div>
            <div className="tl-summary-row total"><span>Total</span><span>{fmtMoney(total)}</span></div>
            <button className="tl-btn tl-btn-amber" style={{ width: "100%", justifyContent: "center", marginTop: 14, height: 44 }} disabled={!selected.length} onClick={handleBookClick}>
              <CalendarCheck size={16} /> {currentUser ? "Book now" : "Login to book"}
            </button>
            <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 10 }}>Free cancellation up to 3 hours before your slot start time.</p>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <div className="tl-overlay" onClick={() => setConfirmOpen(false)}>
          <div className="tl-modal" onClick={(e) => e.stopPropagation()}>
            <button className="tl-modal-close" onClick={() => setConfirmOpen(false)}><X size={16} /></button>
            <h3 style={{ fontSize: 20, marginBottom: 4 }}>Confirm your booking</h3>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 16 }}>Please review the details before confirming.</p>
            <div className="tl-card" style={{ background: "var(--chalk)", marginBottom: 18 }}>
              <div className="tl-summary-row"><span>Ground</span><span>{ground.name}</span></div>
              <div className="tl-summary-row"><span>Date</span><span>{fmtDateLong(date)}</span></div>
              <div className="tl-summary-row"><span>Time</span><span>{selected.map((h) => hourLabel(h)).join(", ")}</span></div>
              <div className="tl-summary-row total"><span>Total amount</span><span>{fmtMoney(total)}</span></div>
            </div>
            <button className="tl-btn tl-btn-amber" style={{ width: "100%", justifyContent: "center", height: 44 }} onClick={confirmBooking}>
              <Wallet size={16} /> Pay & confirm booking
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="tl-overlay" onClick={() => { setResult(null); setSelected([]); onBooked(); }}>
          <div className="tl-modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#E7F3EB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <CircleCheck size={30} color="#1E6B3E" />
            </div>
            <h3 style={{ fontSize: 20 }}>Booking confirmed!</h3>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 4 }}>Your slot is locked in. See you on the ground.</p>
            <div className="tl-card" style={{ background: "var(--chalk)", margin: "16px 0", textAlign: "left" }}>
              <div className="tl-summary-row"><span>Booking ID</span><span className="tl-mono">{result.id}</span></div>
              <div className="tl-summary-row"><span>Ground</span><span>{result.groundName}</span></div>
              <div className="tl-summary-row"><span>Date</span><span>{fmtDateLong(result.date)}</span></div>
              <div className="tl-summary-row"><span>Time</span><span>{result.slots.map((h) => hourLabel(h)).join(", ")}</span></div>
              <div className="tl-summary-row total"><span>Amount paid</span><span>{fmtMoney(result.total)}</span></div>
            </div>
            <button className="tl-btn tl-btn-dark" style={{ width: "100%", justifyContent: "center", height: 42 }} onClick={() => { setResult(null); setSelected([]); onBooked(); }}>
              View my bookings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MY BOOKINGS                                                        */
/* ------------------------------------------------------------------ */
function MyBookings({ bookings, onCancel, onBrowse }) {
  const [tab, setTab] = useState("upcoming");
  const enriched = bookings.map((b) => ({ ...b, computedStatus: computeStatus(b) })).sort((a, b) => b.createdAt - a.createdAt);
  const filtered = enriched.filter((b) => b.computedStatus === tab);
  const counts = { upcoming: 0, completed: 0, cancelled: 0 };
  enriched.forEach((b) => counts[b.computedStatus]++);

  return (
    <div className="tl-container">
      <div className="tl-section">
        <h1 className="tl-page-title">My bookings</h1>
        <p className="tl-page-sub">Track upcoming games and review your booking history.</p>

        <div className="tl-admin-grid" style={{ marginBottom: 26 }}>
          <div className="tl-stat-card"><div className="num">{enriched.length}</div><div className="lbl">Total bookings</div></div>
          <div className="tl-stat-card"><div className="num">{counts.upcoming}</div><div className="lbl">Upcoming</div></div>
          <div className="tl-stat-card"><div className="num">{counts.completed}</div><div className="lbl">Completed</div></div>
          <div className="tl-stat-card"><div className="num">{counts.cancelled}</div><div className="lbl">Cancelled</div></div>
        </div>

        <div className="tl-tabs-row" style={{ maxWidth: 420 }}>
          {["upcoming", "completed", "cancelled"].map((t) => (
            <button key={t} className={`tl-tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t[0].toUpperCase() + t.slice(1)} ({counts[t]})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="tl-empty">
            <CalendarX size={32} />
            <div>No {tab} bookings yet.</div>
            <button className="tl-btn tl-btn-dark" style={{ marginTop: 14 }} onClick={onBrowse}>Browse grounds</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
            {filtered.map((b) => {
              const s = sportById(b.sport);
              return (
                <div className="tl-card" key={b.id} style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 10, background: `${s.color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <SportIcon sport={b.sport} size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15.5 }}>{b.groundName}</div>
                      <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>{fmtDateLong(b.date)} · {b.slots.map((h) => hourLabel(h)).join(", ")}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }} className="tl-mono">{b.id}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <span className={`tl-badge tl-badge-${b.computedStatus}`}>
                      {b.computedStatus === "upcoming" && <CalendarCheck size={12} />}
                      {b.computedStatus === "completed" && <CircleCheck size={12} />}
                      {b.computedStatus === "cancelled" && <XCircle size={12} />}
                      {b.computedStatus[0].toUpperCase() + b.computedStatus.slice(1)}
                    </span>
                    <div style={{ fontWeight: 700 }}>{fmtMoney(b.total)}</div>
                    {b.computedStatus === "upcoming" && (
                      canCancel(b) ? (
                        <button className="tl-btn tl-btn-danger" style={{ padding: "6px 12px", fontSize: 13 }} onClick={() => onCancel(b.id)}>Cancel booking</button>
                      ) : (
                        <span style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>Cancellation window closed</span>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PROFILE                                                            */
/* ------------------------------------------------------------------ */
function Profile({ user, bookings, onLogout, onUpdate }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [editing, setEditing] = useState(false);
  const stats = { total: bookings.length, upcoming: 0, completed: 0, cancelled: 0 };
  bookings.forEach((b) => stats[computeStatus(b)]++);

  function save() {
    onUpdate({ ...user, name, phone });
    setEditing(false);
  }

  return (
    <div className="tl-container">
      <div className="tl-section" style={{ maxWidth: 720 }}>
        <h1 className="tl-page-title">My profile</h1>
        <p className="tl-page-sub">Your account details and booking activity.</p>

        <div className="tl-admin-grid" style={{ marginBottom: 26 }}>
          <div className="tl-stat-card"><div className="num">{stats.total}</div><div className="lbl">Total bookings</div></div>
          <div className="tl-stat-card"><div className="num">{stats.upcoming}</div><div className="lbl">Upcoming</div></div>
          <div className="tl-stat-card"><div className="num">{stats.completed}</div><div className="lbl">Completed</div></div>
          <div className="tl-stat-card"><div className="num">{stats.cancelled}</div><div className="lbl">Cancelled</div></div>
        </div>

        <div className="tl-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 17 }}>Account details</h3>
            {!editing && <button className="tl-btn tl-btn-outline" onClick={() => setEditing(true)}><Edit2 size={14} /> Edit</button>}
          </div>
          {editing ? (
            <>
              <div className="tl-form-row"><label>Full name</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="tl-form-row"><label>Phone number</label><input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="tl-btn tl-btn-dark" onClick={save}><Check size={14} /> Save changes</button>
                <button className="tl-btn tl-btn-outline" onClick={() => { setEditing(false); setName(user.name); setPhone(user.phone); }}>Cancel</button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14.5 }}>
              <div><strong>Name:</strong> {user.name}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Phone:</strong> {user.phone}</div>
            </div>
          )}
        </div>

        <button className="tl-btn tl-btn-danger" style={{ marginTop: 20 }} onClick={onLogout}><LogOut size={15} /> Log out</button>
      </div>
    </div>
  );
}

function LoggedOutPanel({ onLogin, message }) {
  return (
    <div className="tl-container">
      <div className="tl-empty" style={{ marginTop: 40 }}>
        <User size={32} />
        <div style={{ marginBottom: 14 }}>{message}</div>
        <button className="tl-btn tl-btn-amber" onClick={onLogin}><LogIn size={15} /> Login / Sign up</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AUTH MODAL                                                         */
/* ------------------------------------------------------------------ */
function AuthModal({ onClose, onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      if (!email || !password) { setError("Enter email and password."); return; }
      await onLogin({ email, password });
    } else {
      if (!name || !email || !phone || !password) { setError("Please fill every field."); return; }
      if (password.length < 4) { setError("Password should be at least 4 characters."); return; }
      await onRegister({ name, email, phone, password });
    }
  }

  return (
    <div className="tl-overlay" onClick={onClose}>
      <div className="tl-modal" onClick={(e) => e.stopPropagation()}>
        <button className="tl-modal-close" onClick={onClose}><X size={16} /></button>
        <h3 style={{ fontSize: 20, marginBottom: 16 }}>{mode === "login" ? "Log in to TurfLine" : "Create your account"}</h3>
        <div className="tl-auth-toggle">
          <button className="tl-tab-btn" style={{ background: mode === "login" ? "var(--pitch)" : "var(--chalk)", color: mode === "login" ? "white" : "var(--ink)", flex: 1, padding: "9px", borderRadius: 8 }} onClick={() => setMode("login")}>Login</button>
          <button className="tl-tab-btn" style={{ background: mode === "register" ? "var(--pitch)" : "var(--chalk)", color: mode === "register" ? "white" : "var(--ink)", flex: 1, padding: "9px", borderRadius: 8 }} onClick={() => setMode("register")}>Sign up</button>
        </div>

        <div className="tl-demo-hint">Demo account — email: <strong>arjun@example.com</strong>, password: <strong>demo123</strong>. Admin — email: <strong>admin@turfline.app</strong>, password: <strong>admin123</strong>.</div>

        <form onSubmit={submit}>
          {mode === "register" && (
            <div className="tl-form-row"><label>Full name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Sharma" /></div>
          )}
          <div className="tl-form-row"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
          {mode === "register" && (
            <div className="tl-form-row"><label>Phone number</label><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" /></div>
          )}
          <div className="tl-form-row"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></div>
          {error && <div style={{ color: "var(--alert)", fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button className="tl-btn tl-btn-amber" type="submit" style={{ width: "100%", justifyContent: "center", height: 44 }}>
            {mode === "login" ? <><LogIn size={15} /> Log in</> : <><UserPlus size={15} /> Create account</>}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ADMIN DASHBOARD                                                    */
/* ------------------------------------------------------------------ */
function AdminDashboard({ grounds, users, bookings, onUpsertGround, onDeleteGround, onSetBookingStatus, onReset }) {
  const [tab, setTab] = useState("overview");
  const [editingGround, setEditingGround] = useState(null); // null = closed, {} = new, {...} = edit

  const today = next7Days()[0].iso;
  const activeBookings = bookings.filter((b) => b.status !== "cancelled");
  const todaysBookings = activeBookings.filter((b) => b.date === today);
  const revenue = activeBookings.reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="tl-container">
      <div className="tl-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="tl-page-title"><ShieldCheck size={26} style={{ verticalAlign: "-4px", marginRight: 8, color: "var(--turf)" }} />Admin dashboard</h1>
            <p className="tl-page-sub">Manage grounds, bookings, and users across TurfLine.</p>
          </div>
          <button className="tl-btn tl-btn-outline" onClick={onReset}><RotateCcw size={14} /> Reset demo data</button>
        </div>

        <div className="tl-admin-grid" style={{ marginBottom: 26 }}>
          <div className="tl-stat-card"><Building2 size={16} color="var(--turf)" /><div className="num">{grounds.length}</div><div className="lbl">Total grounds</div></div>
          <div className="tl-stat-card"><Users size={16} color="var(--turf)" /><div className="num">{users.length}</div><div className="lbl">Registered users</div></div>
          <div className="tl-stat-card"><CalendarCheck size={16} color="var(--turf)" /><div className="num">{todaysBookings.length}</div><div className="lbl">Today's bookings</div></div>
          <div className="tl-stat-card"><IndianRupee size={16} color="var(--turf)" /><div className="num">{fmtMoney(revenue)}</div><div className="lbl">Total revenue</div></div>
        </div>

        <div className="tl-tabs-row" style={{ maxWidth: 480 }}>
          {["overview", "grounds", "bookings", "users"].map((t) => (
            <button key={t} className={`tl-tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="tl-card" style={{ marginTop: 18 }}>
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Recent bookings</h3>
            <RecentBookingsTable bookings={[...bookings].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8)} />
          </div>
        )}

        {tab === "grounds" && (
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <button className="tl-btn tl-btn-dark" onClick={() => setEditingGround({})}><Plus size={15} /> Add ground</button>
            </div>
            <div className="tl-card" style={{ padding: 0, overflowX: "auto" }}>
              <table className="tl-table">
                <thead><tr><th>Ground</th><th>City</th><th>Sport</th><th>Price/hr</th><th>Rating</th><th></th></tr></thead>
                <tbody>
                  {grounds.map((g) => (
                    <tr key={g.id}>
                      <td style={{ fontWeight: 600 }}>{g.name}</td>
                      <td>{g.city}</td>
                      <td>{sportById(g.sport).name}</td>
                      <td>{fmtMoney(g.price)}</td>
                      <td>{g.rating}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="tl-icon-btn" onClick={() => setEditingGround(g)}><Edit2 size={14} /></button>
                          <button className="tl-icon-btn" onClick={() => onDeleteGround(g.id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "bookings" && (
          <div className="tl-card" style={{ marginTop: 18, padding: 0, overflowX: "auto" }}>
            <table className="tl-table">
              <thead><tr><th>Booking ID</th><th>User</th><th>Ground</th><th>Date</th><th>Time</th><th>Amount</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {[...bookings].sort((a, b) => b.createdAt - a.createdAt).map((b) => {
                  const status = computeStatus(b);
                  return (
                    <tr key={b.id}>
                      <td className="tl-mono">{b.id}</td>
                      <td>{b.userName}</td>
                      <td>{b.groundName}</td>
                      <td>{fmtDateLong(b.date)}</td>
                      <td>{b.slots.map((h) => hourLabel(h)).join(", ")}</td>
                      <td>{fmtMoney(b.total)}</td>
                      <td><span className={`tl-badge tl-badge-${status}`}>{status}</span></td>
                      <td>
                        {status !== "cancelled" && (
                          <button className="tl-btn tl-btn-danger" style={{ padding: "5px 10px", fontSize: 12.5 }} onClick={() => onSetBookingStatus(b.id, "cancelled")}>Cancel</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "users" && (
          <div className="tl-card" style={{ marginTop: 18, padding: 0, overflowX: "auto" }}>
            <table className="tl-table">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Bookings</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>{bookings.filter((b) => b.userId === u.id).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingGround !== null && (
        <GroundEditorModal
          ground={editingGround}
          onClose={() => setEditingGround(null)}
          onSave={(g) => { onUpsertGround(g); setEditingGround(null); }}
        />
      )}
    </div>
  );
}

function RecentBookingsTable({ bookings }) {
  if (!bookings.length) return <div className="tl-empty"><CalendarX size={26} /><div>No bookings yet.</div></div>;
  return (
    <table className="tl-table">
      <thead><tr><th>Booking ID</th><th>User</th><th>Ground</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
      <tbody>
        {bookings.map((b) => {
          const status = computeStatus(b);
          return (
            <tr key={b.id}>
              <td className="tl-mono">{b.id}</td>
              <td>{b.userName}</td>
              <td>{b.groundName}</td>
              <td>{fmtDateLong(b.date)}</td>
              <td>{fmtMoney(b.total)}</td>
              <td><span className={`tl-badge tl-badge-${status}`}>{status}</span></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function GroundEditorModal({ ground, onClose, onSave }) {
  const isNew = !ground.id;
  const [form, setForm] = useState({
    id: ground.id || null,
    name: ground.name || "",
    city: ground.city || "",
    area: ground.area || "",
    sport: ground.sport || "football",
    price: ground.price || 500,
    rating: ground.rating || 4.5,
    facilities: ground.facilities || [],
    desc: ground.desc || "",
  });

  function toggleFacility(f) {
    setForm((prev) => ({ ...prev, facilities: prev.facilities.includes(f) ? prev.facilities.filter((x) => x !== f) : [...prev.facilities, f] }));
  }
  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.city || !form.area) return;
    onSave({ ...form, price: Number(form.price), rating: Number(form.rating) });
  }

  return (
    <div className="tl-overlay" onClick={onClose}>
      <div className="tl-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <button className="tl-modal-close" onClick={onClose}><X size={16} /></button>
        <h3 style={{ fontSize: 20, marginBottom: 16 }}>{isNew ? "Add a new ground" : "Edit ground"}</h3>
        <form onSubmit={submit}>
          <div className="tl-form-row"><label>Ground name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="tl-form-row" style={{ flex: 1 }}><label>City</label><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
            <div className="tl-form-row" style={{ flex: 1 }}><label>Area</label><input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} required /></div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="tl-form-row" style={{ flex: 1 }}>
              <label>Sport</label>
              <select value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })}>
                {SPORTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="tl-form-row" style={{ flex: 1 }}><label>Price / hour (₹)</label><input type="number" min="100" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
          </div>
          <div className="tl-form-row"><label>Rating</label><input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
          <div className="tl-form-row">
            <label>Facilities</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.entries(FACILITY_META).map(([key, meta]) => (
                <label key={key} className="tl-checkbox-row" style={{ background: "var(--chalk)", padding: "4px 10px", borderRadius: 20 }}>
                  <input type="checkbox" checked={form.facilities.includes(key)} onChange={() => toggleFacility(key)} /> {meta.label}
                </label>
              ))}
            </div>
          </div>
          <div className="tl-form-row"><label>Description</label><textarea rows={3} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></div>
          <button className="tl-btn tl-btn-dark" type="submit" style={{ width: "100%", justifyContent: "center", height: 42 }}><Check size={15} /> {isNew ? "Add ground" : "Save changes"}</button>
        </form>
      </div>
    </div>
  );
}
