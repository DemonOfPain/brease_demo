// Centralized mock data store for demo
// This allows changes made by AI assistant to persist across the UI

interface MockTeamMember {
  id: string
  name: string
  email: string
  role: string
  bio: string
  image: string
  avatar?: string
}

interface MockPage {
  id: string
  uuid?: string
  name: string
  slug: string
  path: string
  title?: string
  metaDescription?: string
  keywords?: string[]
  sections: any[]
  lastUpdated: string
  siteId?: string
}

interface MockNavItem {
  id: string
  label: string
  path: string
  order: number
  children?: MockNavItem[]
}

interface MockScript {
  id: string
  name: string
  description: string
  code: string
  location: 'head' | 'body'
  enabled: boolean
  addedDate?: string
}

interface MockSite {
  uuid: string
  name: string
  slug: string
  domain: string
  status: string
  description: string
  pages?: MockPage[]
  navigation?: MockNavItem[]
  scripts?: MockScript[]
  // Add dummy fields to prevent errors
  environments?: any[]
  users?: any[]
  siteAvatar?: string
}

class MockDataStore {
  private static instance: MockDataStore
  
  // Initial data
  private teamMembers: MockTeamMember[] = [
    {
      id: 'member-001',
      name: 'John Doe',
      email: 'john.doe@brease.com',
      role: 'Software Developer',
      bio: 'Software Developer with 5 years of experience in building scalable web applications.',
      image: '/images/john-doe.jpg'
    },
    {
      id: 'member-002',
      name: 'Jane Smith',
      email: 'jane.smith@brease.com',
      role: 'Product Manager',
      bio: 'Product Manager passionate about creating user-centric solutions.',
      image: '/images/jane-smith.jpg'
    },
    {
      id: 'member-003',
      name: 'Mike Johnson',
      email: 'mike.johnson@brease.com',
      role: 'UX Designer',
      bio: 'UX Designer focused on creating intuitive and beautiful interfaces.',
      image: '/images/mike-johnson.jpg'
    },
    {
      id: 'member-004',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@brease.com',
      role: 'Marketing Director',
      bio: 'Marketing Director with expertise in digital marketing and brand strategy.',
      image: '/images/sarah-wilson.jpg'
    }
  ]

  private pages: MockPage[] = [
    {
      id: 'page-001',
      uuid: 'page-001',
      name: 'Home',
      slug: 'home',
      path: '/',
      title: 'Welcome to Our Company',
      metaDescription: 'Leading provider of innovative solutions',
      keywords: ['innovation', 'technology', 'solutions'],
      sections: [
        { id: 'section-001', type: 'hero', title: 'Welcome to Our Company', content: 'Leading the way in innovation' },
        { id: 'section-002', type: 'features', title: 'Our Services', items: ['Web Development', 'Mobile Apps', 'Consulting'] },
        { id: 'section-003', type: 'cta', title: 'Get Started', buttonText: 'Contact Us' }
      ],
      lastUpdated: '2 hours ago',
      siteId: 'site-001'
    },
    // Removed About page - will be created via document upload demo
    {
      id: 'page-003',
      uuid: 'page-003',
      name: 'Team Members',
      slug: 'team',
      path: '/team',
      title: 'Our Team',
      metaDescription: 'Meet our talented team members',
      keywords: ['team', 'staff', 'people'],
      sections: [
        { id: 'section-007', type: 'collection', title: 'Our Team', collectionType: 'team-members' }
      ],
      lastUpdated: '3 days ago',
      siteId: 'site-001'
    },
    {
      id: 'page-004',
      uuid: 'page-004',
      name: 'Contact',
      slug: 'contact',
      path: '/contact',
      title: 'Contact Us',
      metaDescription: 'Get in touch with our team',
      keywords: ['contact', 'support', 'help'],
      sections: [
        { id: 'section-008', type: 'contact-form', title: 'Get in Touch' },
        { id: 'section-009', type: 'map', title: 'Find Us', address: '123 Main St, City' }
      ],
      lastUpdated: '1 week ago',
      siteId: 'site-001'
    }
  ]

  private navigation: MockNavItem[] = [
    { id: 'nav-001', label: 'Home', path: '/', order: 1 },
    { id: 'nav-002', label: 'About', path: '/about', order: 2 },
    { id: 'nav-003', label: 'Team', path: '/team', order: 3 },
    { id: 'nav-004', label: 'Services', path: '/services', order: 4, children: [
      { id: 'nav-005', label: 'Web Development', path: '/services/web', order: 1 },
      { id: 'nav-006', label: 'Mobile Apps', path: '/services/mobile', order: 2 }
    ]},
    { id: 'nav-007', label: 'Contact', path: '/contact', order: 5 }
  ]

  private sites: MockSite[] = [
    {
      uuid: 'site-001',
      name: 'Brease Demo Site',
      slug: 'brease-demo-site',
      domain: 'demo.brease.com',
      status: 'published',
      description: 'Main demo website showcasing AI-powered CMS features',
      scripts: [],
      environments: [{ name: 'main', locales: ['en'] }],
      users: []
    },
    {
      uuid: 'site-002',
      name: 'Blog Platform',
      slug: 'blog-platform',
      domain: 'blog.example.com',
      status: 'published',
      description: 'Company blog and news platform',
      scripts: [],
      environments: [{ name: 'main', locales: ['en'] }],
      users: []
    },
    {
      uuid: 'site-003',
      name: 'E-Commerce Store',
      slug: 'ecommerce-store',
      domain: 'shop.example.com',
      status: 'draft',
      description: 'Online store (under development)',
      scripts: [],
      environments: [{ name: 'main', locales: ['en'] }],
      users: []
    }
  ]

  private constructor() {}

  static getInstance(): MockDataStore {
    if (!MockDataStore.instance) {
      MockDataStore.instance = new MockDataStore()
    }
    return MockDataStore.instance
  }

  // Team Members
  getTeamMembers(): MockTeamMember[] {
    return this.teamMembers
  }

  getTeamMember(id: string): MockTeamMember | undefined {
    return this.teamMembers.find(m => m.id === id)
  }

  updateTeamMember(id: string, updates: Partial<MockTeamMember>): MockTeamMember | null {
    const index = this.teamMembers.findIndex(m => m.id === id)
    if (index !== -1) {
      this.teamMembers[index] = { ...this.teamMembers[index], ...updates }
      return this.teamMembers[index]
    }
    return null
  }

  removeTeamMember(id: string): boolean {
    const index = this.teamMembers.findIndex(m => m.id === id)
    if (index !== -1) {
      this.teamMembers.splice(index, 1)
      return true
    }
    return false
  }

  // Pages
  getPages(siteId?: string): MockPage[] {
    if (siteId) {
      return this.pages.filter(p => p.siteId === siteId)
    }
    return this.pages
  }

  getPage(id: string): MockPage | undefined {
    return this.pages.find(p => p.id === id || p.uuid === id)
  }

  updatePage(id: string, updates: Partial<MockPage>): boolean {
    const index = this.pages.findIndex(p => p.id === id || p.uuid === id)
    if (index !== -1) {
      this.pages[index] = { ...this.pages[index], ...updates }
      // Also update the path if slug changes
      if (updates.slug) {
        this.pages[index].path = `/${updates.slug}`
      }
      return true
    }
    return false
  }

  createPage(page: Partial<MockPage>): MockPage {
    // If this is the Company Profile page from the demo, add real sections
    const isCompanyProfile = page.name === 'Company Profile'
    
    const sections = isCompanyProfile ? [
      {
        id: 'section-cp-001',
        type: 'hero',
        title: 'Welcome to Our Company',
        subtitle: 'Leading Innovation in Digital Solutions',
        content: 'We are a forward-thinking technology company dedicated to transforming businesses through innovative digital solutions. With over a decade of experience, we\'ve helped hundreds of companies achieve their digital transformation goals.',
        backgroundImage: '/images/hero-bg.jpg',
        ctaText: 'Get Started',
        ctaLink: '#contact'
      },
      {
        id: 'section-cp-002',
        type: 'text',
        title: 'About Us',
        content: `Founded in 2014, our company has grown from a small startup to a leading provider of digital solutions. We believe in the power of technology to solve complex business challenges and create meaningful impact.

Our journey began with a simple mission: to make enterprise-grade technology accessible to businesses of all sizes. Today, we serve over 500 clients across 20 countries, delivering solutions that drive growth, efficiency, and innovation.

What sets us apart is our commitment to understanding each client's unique needs. We don't believe in one-size-fits-all solutions. Instead, we craft tailored strategies that align with your business goals and deliver measurable results.`,
        layout: 'centered'
      },
      {
        id: 'section-cp-003',
        type: 'text',
        title: 'Our Services',
        content: `We offer a comprehensive suite of services designed to meet the evolving needs of modern businesses:

**Digital Transformation Consulting**
Navigate your digital journey with expert guidance. We help you identify opportunities, develop strategies, and implement solutions that drive real business value.

**Custom Software Development**
From web applications to mobile apps, we build robust, scalable solutions tailored to your specific requirements. Our agile development process ensures rapid delivery without compromising quality.

**Cloud Solutions & Infrastructure**
Leverage the power of cloud computing to scale your operations, reduce costs, and improve flexibility. We provide end-to-end cloud services, from migration to optimization.

**Data Analytics & AI**
Transform your data into actionable insights. Our analytics solutions help you make informed decisions, predict trends, and stay ahead of the competition.`,
        layout: 'full-width'
      },
      {
        id: 'section-cp-004',
        type: 'team',
        title: 'Meet the Team',
        subtitle: 'The talented people behind our success',
        members: [
          {
            name: 'Sarah Johnson',
            role: 'CEO & Founder',
            bio: 'Visionary leader with 15+ years in tech innovation',
            image: '/images/team-1.jpg'
          },
          {
            name: 'Michael Chen',
            role: 'CTO',
            bio: 'Expert in cloud architecture and scalable systems',
            image: '/images/team-2.jpg'
          },
          {
            name: 'Emily Rodriguez',
            role: 'Head of Design',
            bio: 'Award-winning designer focused on user experience',
            image: '/images/team-3.jpg'
          },
          {
            name: 'David Kim',
            role: 'Lead Developer',
            bio: 'Full-stack engineer passionate about clean code',
            image: '/images/team-4.jpg'
          }
        ]
      },
      {
        id: 'section-cp-005',
        type: 'contact',
        title: 'Get in Touch',
        subtitle: 'Ready to start your project? Let\'s talk!',
        content: 'We\'re here to help you achieve your digital goals. Whether you have a specific project in mind or just want to explore possibilities, our team is ready to assist.',
        fields: [
          { name: 'name', label: 'Your Name', type: 'text', required: true },
          { name: 'email', label: 'Email Address', type: 'email', required: true },
          { name: 'company', label: 'Company', type: 'text', required: false },
          { name: 'message', label: 'How can we help?', type: 'textarea', required: true }
        ],
        contactInfo: {
          email: 'hello@company.com',
          phone: '+1 (555) 123-4567',
          address: '123 Innovation Drive, Tech City, TC 12345'
        }
      }
    ] : page.sections || []

    const newPage: MockPage = {
      id: `page-${Date.now()}`,
      uuid: `page-${Date.now()}`,
      name: page.name || 'New Page',
      slug: page.slug || 'new-page',
      path: page.path || '/new-page',
      title: page.title || page.name || 'New Page',
      metaDescription: page.metaDescription || '',
      keywords: page.keywords || [],
      sections: sections,
      lastUpdated: 'Just now',
      siteId: page.siteId || 'site-001'
    }
    this.pages.push(newPage)
    return newPage
  }

  updatePage(id: string, updates: Partial<MockPage>): MockPage | null {
    const index = this.pages.findIndex(p => p.id === id || p.uuid === id)
    if (index !== -1) {
      this.pages[index] = { 
        ...this.pages[index], 
        ...updates,
        lastUpdated: 'Just now'
      }
      return this.pages[index]
    }
    return null
  }

  // Navigation
  getNavigation(): MockNavItem[] {
    return this.navigation
  }

  addNavItem(item: Partial<MockNavItem>): MockNavItem {
    const newItem: MockNavItem = {
      id: `nav-${Date.now()}`,
      label: item.label || 'New Item',
      path: item.path || '/new',
      order: item.order || this.navigation.length + 1
    }
    this.navigation.push(newItem)
    this.navigation.sort((a, b) => a.order - b.order)
    return newItem
  }

  updateNavItem(id: string, updates: Partial<MockNavItem>): MockNavItem | null {
    const index = this.navigation.findIndex(n => n.id === id)
    if (index !== -1) {
      this.navigation[index] = { ...this.navigation[index], ...updates }
      if (updates.order !== undefined) {
        this.navigation.sort((a, b) => a.order - b.order)
      }
      return this.navigation[index]
    }
    return null
  }

  removeNavItem(id: string): boolean {
    const index = this.navigation.findIndex(n => n.id === id)
    if (index !== -1) {
      this.navigation.splice(index, 1)
      return true
    }
    return false
  }

  // Sites
  getSites(): MockSite[] {
    return this.sites.map(site => ({
      ...site,
      pages: this.pages.filter(p => p.siteId === site.uuid)
    }))
  }

  getSite(id: string): MockSite | undefined {
    const site = this.sites.find(s => s.uuid === id)
    if (site) {
      return {
        ...site,
        pages: this.pages.filter(p => p.siteId === site.uuid),
        navigation: this.navigation
      }
    }
    return undefined
  }

  addScript(siteId: string, script: any): boolean {
    const site = this.sites.find(s => s.uuid === siteId)
    if (site) {
      if (!site.scripts) site.scripts = []
      const newScript: MockScript = {
        id: script.id || `script-${Date.now()}`,
        name: script.name || 'Custom Script',
        description: script.description || '',
        code: script.code || script.content || '',
        location: script.location || 'head',
        enabled: script.enabled !== undefined ? script.enabled : true,
        addedDate: script.addedDate || 'Just now'
      }
      site.scripts.push(newScript)
      return true
    }
    return false
  }

  // Search for content
  searchContent(query: string): any[] {
    const results: any[] = []
    const lowerQuery = query.toLowerCase()

    // Search in team members - use fresh data
    this.getTeamMembers().forEach(member => {
      if (member.name.toLowerCase().includes(lowerQuery) || 
          member.bio.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'team_member',
          id: member.id,
          title: member.name,
          path: `/collections/team/${member.id}`,
          preview: member.bio.substring(0, 100) + (member.bio.length > 100 ? '...' : ''),
          confidence: member.name.toLowerCase().includes(lowerQuery) ? 0.95 : 0.75
        })
      }
    })

    // Search in pages
    this.pages.forEach(page => {
      if (page.name.toLowerCase().includes(lowerQuery) || 
          page.title?.toLowerCase().includes(lowerQuery) ||
          page.metaDescription?.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'page',
          id: page.id,
          title: page.name,
          path: page.path,
          preview: page.metaDescription || page.title,
          confidence: page.name.toLowerCase().includes(lowerQuery) ? 0.85 : 0.65
        })
      }
    })

    return results.sort((a, b) => b.confidence - a.confidence)
  }
}

export const mockData = MockDataStore.getInstance()