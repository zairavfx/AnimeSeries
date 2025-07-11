import {
  users,
  pages,
  services,
  servicePlans,
  mediaFiles,
  siteSettings,
  contactSubmissions,
  navigationItems,
  activityLogs,
  type User,
  type UpsertUser,
  type Page,
  type InsertPage,
  type Service,
  type InsertService,
  type ServicePlan,
  type InsertServicePlan,
  type MediaFile,
  type InsertMediaFile,
  type SiteSetting,
  type InsertSiteSetting,
  type ContactSubmission,
  type InsertContactSubmission,
  type NavigationItem,
  type InsertNavigationItem,
  type ActivityLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (Required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Page operations
  getPages(): Promise<Page[]>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  getPage(id: number): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: number, page: Partial<InsertPage>): Promise<Page>;
  deletePage(id: number): Promise<void>;
  
  // Service operations
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;
  
  // Service plan operations
  getServicePlans(serviceId?: number): Promise<ServicePlan[]>;
  getServicePlan(id: number): Promise<ServicePlan | undefined>;
  createServicePlan(plan: InsertServicePlan): Promise<ServicePlan>;
  updateServicePlan(id: number, plan: Partial<InsertServicePlan>): Promise<ServicePlan>;
  deleteServicePlan(id: number): Promise<void>;
  
  // Media operations
  getMediaFiles(): Promise<MediaFile[]>;
  getMediaFile(id: number): Promise<MediaFile | undefined>;
  createMediaFile(file: InsertMediaFile): Promise<MediaFile>;
  updateMediaFile(id: number, file: Partial<InsertMediaFile>): Promise<MediaFile>;
  deleteMediaFile(id: number): Promise<void>;
  
  // Site settings operations
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  deleteSiteSetting(key: string): Promise<void>;
  
  // Navigation operations
  getNavigationItems(): Promise<NavigationItem[]>;
  createNavigationItem(item: InsertNavigationItem): Promise<NavigationItem>;
  updateNavigationItem(id: number, item: Partial<InsertNavigationItem>): Promise<NavigationItem>;
  deleteNavigationItem(id: number): Promise<void>;
  
  // Contact operations
  getContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  updateContactSubmission(id: number, submission: Partial<ContactSubmission>): Promise<ContactSubmission>;
  
  // Activity log operations
  createActivityLog(log: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog>;
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (Required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Page operations
  async getPages(): Promise<Page[]> {
    return await db.select().from(pages).orderBy(asc(pages.sortOrder), desc(pages.updatedAt));
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page;
  }

  async getPage(id: number): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.id, id));
    return page;
  }

  async createPage(page: InsertPage): Promise<Page> {
    const [newPage] = await db.insert(pages).values(page).returning();
    return newPage;
  }

  async updatePage(id: number, page: Partial<InsertPage>): Promise<Page> {
    const [updatedPage] = await db
      .update(pages)
      .set({ ...page, updatedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();
    return updatedPage;
  }

  async deletePage(id: number): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(asc(services.sortOrder), asc(services.name));
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.slug, slug));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Service plan operations
  async getServicePlans(serviceId?: number): Promise<ServicePlan[]> {
    const query = db.select().from(servicePlans);
    if (serviceId) {
      return await query.where(eq(servicePlans.serviceId, serviceId)).orderBy(asc(servicePlans.sortOrder));
    }
    return await query.orderBy(asc(servicePlans.sortOrder));
  }

  async getServicePlan(id: number): Promise<ServicePlan | undefined> {
    const [plan] = await db.select().from(servicePlans).where(eq(servicePlans.id, id));
    return plan;
  }

  async createServicePlan(plan: InsertServicePlan): Promise<ServicePlan> {
    const [newPlan] = await db.insert(servicePlans).values(plan).returning();
    return newPlan;
  }

  async updateServicePlan(id: number, plan: Partial<InsertServicePlan>): Promise<ServicePlan> {
    const [updatedPlan] = await db
      .update(servicePlans)
      .set({ ...plan, updatedAt: new Date() })
      .where(eq(servicePlans.id, id))
      .returning();
    return updatedPlan;
  }

  async deleteServicePlan(id: number): Promise<void> {
    await db.delete(servicePlans).where(eq(servicePlans.id, id));
  }

  // Media operations
  async getMediaFiles(): Promise<MediaFile[]> {
    return await db.select().from(mediaFiles).orderBy(desc(mediaFiles.createdAt));
  }

  async getMediaFile(id: number): Promise<MediaFile | undefined> {
    const [file] = await db.select().from(mediaFiles).where(eq(mediaFiles.id, id));
    return file;
  }

  async createMediaFile(file: InsertMediaFile): Promise<MediaFile> {
    const [newFile] = await db.insert(mediaFiles).values(file).returning();
    return newFile;
  }

  async updateMediaFile(id: number, file: Partial<InsertMediaFile>): Promise<MediaFile> {
    const [updatedFile] = await db
      .update(mediaFiles)
      .set(file)
      .where(eq(mediaFiles.id, id))
      .returning();
    return updatedFile;
  }

  async deleteMediaFile(id: number): Promise<void> {
    await db.delete(mediaFiles).where(eq(mediaFiles.id, id));
  }

  // Site settings operations
  async getSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings).orderBy(asc(siteSettings.key));
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }

  async upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const [upsertedSetting] = await db
      .insert(siteSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          ...setting,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedSetting;
  }

  async deleteSiteSetting(key: string): Promise<void> {
    await db.delete(siteSettings).where(eq(siteSettings.key, key));
  }

  // Navigation operations
  async getNavigationItems(): Promise<NavigationItem[]> {
    return await db.select().from(navigationItems).orderBy(asc(navigationItems.sortOrder));
  }

  async createNavigationItem(item: InsertNavigationItem): Promise<NavigationItem> {
    const [newItem] = await db.insert(navigationItems).values(item).returning();
    return newItem;
  }

  async updateNavigationItem(id: number, item: Partial<InsertNavigationItem>): Promise<NavigationItem> {
    const [updatedItem] = await db
      .update(navigationItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(navigationItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteNavigationItem(id: number): Promise<void> {
    await db.delete(navigationItems).where(eq(navigationItems.id, id));
  }

  // Contact operations
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [newSubmission] = await db.insert(contactSubmissions).values(submission).returning();
    return newSubmission;
  }

  async updateContactSubmission(id: number, submission: Partial<ContactSubmission>): Promise<ContactSubmission> {
    const [updatedSubmission] = await db
      .update(contactSubmissions)
      .set({ ...submission, updatedAt: new Date() })
      .where(eq(contactSubmissions.id, id))
      .returning();
    return updatedSubmission;
  }

  // Activity log operations
  async createActivityLog(log: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog> {
    const [newLog] = await db.insert(activityLogs).values(log).returning();
    return newLog;
  }

  async getActivityLogs(limit: number = 50): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limit);
  }
}

export const storage = new DatabaseStorage();
