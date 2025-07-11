import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPageSchema, insertServiceSchema, insertServicePlanSchema, insertContactSubmissionSchema, insertNavigationItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public API routes (no authentication required)
  
  // Get published pages
  app.get('/api/pages', async (req, res) => {
    try {
      const pages = await storage.getPages();
      const publishedPages = pages.filter(page => page.isPublished);
      res.json(publishedPages);
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  // Get page by slug
  app.get('/api/pages/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const page = await storage.getPageBySlug(slug);
      
      if (!page || !page.isPublished) {
        return res.status(404).json({ message: "Page not found" });
      }
      
      res.json(page);
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  // Get active services
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getServices();
      const activeServices = services.filter(service => service.isActive);
      res.json(activeServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get service by slug with plans
  app.get('/api/services/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const service = await storage.getServiceBySlug(slug);
      
      if (!service || !service.isActive) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      const plans = await storage.getServicePlans(service.id);
      const activePlans = plans.filter(plan => plan.isActive);
      
      res.json({ ...service, plans: activePlans });
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  // Get navigation items
  app.get('/api/navigation', async (req, res) => {
    try {
      const items = await storage.getNavigationItems();
      const visibleItems = items.filter(item => item.isVisible);
      res.json(visibleItems);
    } catch (error) {
      console.error("Error fetching navigation:", error);
      res.status(500).json({ message: "Failed to fetch navigation" });
    }
  });

  // Public site settings
  app.get('/api/settings/public', async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      const publicSettings = settings.filter(setting => setting.isPublic);
      const settingsMap = publicSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>);
      res.json(settingsMap);
    } catch (error) {
      console.error("Error fetching public settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Contact form submission
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission({
        ...validatedData,
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      });
      res.json({ message: "Contact submission received", id: submission.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      console.error("Error creating contact submission:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Protected Admin API routes (require authentication and admin role)
  
  const requireAdmin = async (req: any, res: any, next: any) => {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(userId);
    if (!user || (user.role !== 'super_admin' && user.role !== 'editor')) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    
    req.currentUser = user;
    next();
  };

  // Admin dashboard stats
  app.get('/api/admin/dashboard/stats', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const pages = await storage.getPages();
      const services = await storage.getServices();
      const mediaFiles = await storage.getMediaFiles();
      const contactSubmissions = await storage.getContactSubmissions();
      
      const stats = {
        totalPages: pages.length,
        publishedPages: pages.filter(p => p.isPublished).length,
        totalServices: services.length,
        activeServices: services.filter(s => s.isActive).length,
        totalMediaFiles: mediaFiles.length,
        totalContacts: contactSubmissions.length,
        newContacts: contactSubmissions.filter(c => c.status === 'new').length,
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Admin activity logs
  app.get('/api/admin/activity-logs', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await storage.getActivityLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // Admin pages management
  app.get('/api/admin/pages', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const pages = await storage.getPages();
      res.json(pages);
    } catch (error) {
      console.error("Error fetching admin pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  app.post('/api/admin/pages', isAuthenticated, requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertPageSchema.parse(req.body);
      const page = await storage.createPage({
        ...validatedData,
        createdBy: req.currentUser.id,
      });
      
      // Log activity
      await storage.createActivityLog({
        userId: req.currentUser.id,
        action: 'create',
        resource: 'page',
        resourceId: page.id.toString(),
        details: { title: page.title, slug: page.slug },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      res.json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid page data", errors: error.errors });
      }
      console.error("Error creating page:", error);
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  app.put('/api/admin/pages/:id', isAuthenticated, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPageSchema.partial().parse(req.body);
      const page = await storage.updatePage(id, validatedData);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.currentUser.id,
        action: 'update',
        resource: 'page',
        resourceId: id.toString(),
        details: { changes: validatedData },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      res.json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid page data", errors: error.errors });
      }
      console.error("Error updating page:", error);
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  app.delete('/api/admin/pages/:id', isAuthenticated, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const page = await storage.getPage(id);
      
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      
      await storage.deletePage(id);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.currentUser.id,
        action: 'delete',
        resource: 'page',
        resourceId: id.toString(),
        details: { title: page.title, slug: page.slug },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      res.json({ message: "Page deleted successfully" });
    } catch (error) {
      console.error("Error deleting page:", error);
      res.status(500).json({ message: "Failed to delete page" });
    }
  });

  // Admin services management
  app.get('/api/admin/services', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching admin services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post('/api/admin/services', isAuthenticated, requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.currentUser.id,
        action: 'create',
        resource: 'service',
        resourceId: service.id.toString(),
        details: { name: service.name, slug: service.slug },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  app.put('/api/admin/services/:id', isAuthenticated, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, validatedData);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.currentUser.id,
        action: 'update',
        resource: 'service',
        resourceId: id.toString(),
        details: { changes: validatedData },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      console.error("Error updating service:", error);
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  // Admin service plans management
  app.get('/api/admin/services/:serviceId/plans', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const serviceId = parseInt(req.params.serviceId);
      const plans = await storage.getServicePlans(serviceId);
      res.json(plans);
    } catch (error) {
      console.error("Error fetching service plans:", error);
      res.status(500).json({ message: "Failed to fetch service plans" });
    }
  });

  app.post('/api/admin/service-plans', isAuthenticated, requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertServicePlanSchema.parse(req.body);
      const plan = await storage.createServicePlan(validatedData);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.currentUser.id,
        action: 'create',
        resource: 'service_plan',
        resourceId: plan.id.toString(),
        details: { name: plan.name, serviceId: plan.serviceId },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      res.json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid plan data", errors: error.errors });
      }
      console.error("Error creating service plan:", error);
      res.status(500).json({ message: "Failed to create service plan" });
    }
  });

  app.put('/api/admin/service-plans/:id', isAuthenticated, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertServicePlanSchema.partial().parse(req.body);
      const plan = await storage.updateServicePlan(id, validatedData);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.currentUser.id,
        action: 'update',
        resource: 'service_plan',
        resourceId: id.toString(),
        details: { changes: validatedData },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      res.json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid plan data", errors: error.errors });
      }
      console.error("Error updating service plan:", error);
      res.status(500).json({ message: "Failed to update service plan" });
    }
  });

  app.delete('/api/admin/service-plans/:id', isAuthenticated, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getServicePlan(id);
      
      if (!plan) {
        return res.status(404).json({ message: "Service plan not found" });
      }
      
      await storage.deleteServicePlan(id);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.currentUser.id,
        action: 'delete',
        resource: 'service_plan',
        resourceId: id.toString(),
        details: { name: plan.name, serviceId: plan.serviceId },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      res.json({ message: "Service plan deleted successfully" });
    } catch (error) {
      console.error("Error deleting service plan:", error);
      res.status(500).json({ message: "Failed to delete service plan" });
    }
  });

  // Admin media management
  app.get('/api/admin/media', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const mediaFiles = await storage.getMediaFiles();
      res.json(mediaFiles);
    } catch (error) {
      console.error("Error fetching media files:", error);
      res.status(500).json({ message: "Failed to fetch media files" });
    }
  });

  // Admin navigation management
  app.get('/api/admin/navigation', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const items = await storage.getNavigationItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching navigation items:", error);
      res.status(500).json({ message: "Failed to fetch navigation items" });
    }
  });

  app.post('/api/admin/navigation', isAuthenticated, requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertNavigationItemSchema.parse(req.body);
      const item = await storage.createNavigationItem(validatedData);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.currentUser.id,
        action: 'create',
        resource: 'navigation_item',
        resourceId: item.id.toString(),
        details: { label: item.label, path: item.path },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid navigation item data", errors: error.errors });
      }
      console.error("Error creating navigation item:", error);
      res.status(500).json({ message: "Failed to create navigation item" });
    }
  });

  // Admin contact submissions
  app.get('/api/admin/contacts', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
