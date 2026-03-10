
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

// --- Helper to clone and modify config ---
const createConfig = (base: any, overrides: any) => {
  return {
    ...base,
    colors: { ...base.colors, ...overrides.colors },
    typography: { ...base.typography, ...overrides.typography },
    components: { ...base.components, ...overrides.components },
    assets: { ...base.assets, ...overrides.assets }
  }
}

const baseConfig = {
  colors: {
    primary: "hsl(222.2 47.4% 11.2%)",
    secondary: "hsl(210 40% 96.1%)",
    background: "hsl(0 0% 100%)",
    foreground: "hsl(222.2 84% 4.9%)",
    muted: "hsl(210 40% 96.1%)",
    mutedForeground: "hsl(215.4 16.3% 46.9%)",
    border: "hsl(214.3 31.8% 91.4%)",
    input: "hsl(214.3 31.8% 91.4%)",
    ring: "hsl(222.2 84% 4.9%)",
    radius: "0.5rem"
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    headingFont: "Inter, sans-serif"
  },
  components: {
    button: { variant: "default", radius: "0.5rem", shadow: "none" },
    card: { radius: "0.5rem", shadow: "sm", border: true },
    input: { variant: "default", radius: "0.5rem" }
  },
  assets: {
    backgroundImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2070&q=80",
    sidebarImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=80"
  }
}

// --- Specific Theme Configs ---

const professionalConfig = createConfig(baseConfig, {
  colors: {
    primary: "hsl(222.2 47.4% 11.2%)", // Standard Blue
    radius: "0.375rem"
  }
})

const modernConfig = createConfig(baseConfig, {
  colors: {
    primary: "hsl(262.1 83.3% 57.8%)", // Purple
    secondary: "hsl(210 40% 96.1%)",
    radius: "1rem"
  }
})

const retroConfig = createConfig(baseConfig, {
  colors: {
    primary: "hsl(316 73% 52%)", // Neon Pink
    background: "hsl(260 30% 12%)", // Dark Purple BG
    foreground: "hsl(316 70% 95%)",
    muted: "hsl(260 20% 18%)",
    border: "hsl(316 73% 52%)", // Pink Border
    radius: "0px" // Sharp edges
  },
  typography: { fontFamily: "'Courier New', monospace" }
})

const minimalistConfig = createConfig(baseConfig, {
  colors: {
    primary: "hsl(0 0% 9%)", // Black
    background: "hsl(0 0% 100%)", // White
    radius: "0px"
  }
})

const corporateConfig = createConfig(baseConfig, {
  colors: {
    primary: "hsl(221.2 83.2% 53.3%)", // Trust Blue
    radius: "0.25rem"
  }
})

const creativeConfig = createConfig(baseConfig, {
  colors: {
    primary: "hsl(24.6 95% 53.1%)", // Vibrant Orange
    radius: "1.5rem"
  }
})

const premiumConfig = createConfig(baseConfig, {
    colors: {
      primary: "hsl(47.9 95.8% 53.1%)", // Gold
      background: "hsl(20 14.3% 4.1%)", // Dark
      foreground: "hsl(60 9.1% 97.8%)",
      muted: "hsl(12 6.5% 15.1%)",
      border: "hsl(12 6.5% 15.1%)",
      radius: "0.75rem"
    }
})

// --- Custom Palette for Healthcare Green (Dark Plantie Theme) ---
// Dark Background: #050902 (Deep background)
// Forest Green: #16220F (Main dark UI background)
// Dark Green: #22301B (Cards / panels)
// Muted Green: #3E4F33 (Secondary UI areas)
// Leaf Green: #2E5216 (Buttons / highlights)
// Natural Green: #57763C (Plant accent)
// Olive Green: #909875 (Subtle UI accents)
// Soft Light: #D2E3DA (Text / light contrast)

const healthcareGreenConfig = createConfig(baseConfig, {
  colors: {
    background: "#050902",           // Deep background
    foreground: "#D2E3DA",           // Text / light contrast
    primary: "#2E5216",              // Buttons / highlights (Leaf Green)
    primaryForeground: "#D2E3DA",    // Text on button
    secondary: "#3E4F33",            // Secondary UI areas (Muted Green)
    secondaryForeground: "#D2E3DA",
    muted: "#16220F",                // Main dark UI background (Forest Green)
    mutedForeground: "#909875",      // Subtle UI accents (Olive Green)
    border: "#57763C",               // Plant accent (Natural Green)
    input: "#22301B",                // Cards / panels (Dark Green)
    ring: "#57763C",                 // Plant accent
    radius: "2rem"                   // Pill shape buttons
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    headingFont: "Inter, sans-serif"
  },
  components: {
    button: {
      variant: "default",
      radius: "9999px",
      shadow: "0 0 15px rgba(87, 118, 60, 0.3)" // Natural Green Glow
    },
    card: {
      radius: "1.5rem",
      shadow: "none",
      border: false
    },
    input: {
      variant: "filled",
      radius: "1rem"
    }
  },
  assets: {
    backgroundImage: "https://images.unsplash.com/photo-1603909223429-69bb7101f420?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    sidebarImage: "https://images.unsplash.com/photo-1615486363973-9a7877b3f2ae?auto=format&fit=crop&w=900&q=80"
  }
})


async function main() {
  console.log('Seeding themes...')

  // Clear existing themes to avoid duplicates if categories changed
  // await prisma.theme.deleteMany({}) // Optional: Uncomment if you want a clean slate

  // 1. Professional (8 themes)
  const professionalThemes = ['Default', 'Modern', 'Material', 'SaaS', 'Flat', 'Mono', 'Elegant', 'Silver']
  for (const name of professionalThemes) {
    await prisma.theme.upsert({
      where: { name },
      update: { 
        category: 'Professional',
        config: JSON.stringify(professionalConfig) 
      },
      create: {
        name,
        category: 'Professional',
        layout: 'Centered',
        isPremium: false,
        isActive: name === 'Default', // Default is active
        config: JSON.stringify(professionalConfig)
      }
    })
  }

  // 2. Minimal (5 themes)
  const minimalThemes = ['Black and White', 'Minimal', 'Soft', 'Zen', 'Neo']
  for (const name of minimalThemes) {
    await prisma.theme.upsert({
      where: { name },
      update: { 
        category: 'Minimal',
        config: JSON.stringify(minimalistConfig)
       },
      create: {
        name,
        category: 'Minimal',
        layout: 'Centered',
        isPremium: false,
        config: JSON.stringify(minimalistConfig)
      }
    })
  }

  // 3. Creative (6 themes)
  const creativeThemes = ['Galaxy', 'Luxe', 'Retro', 'Neon', 'Pixel', 'Prism']
  for (const name of creativeThemes) {
    await prisma.theme.upsert({
      where: { name },
      update: { 
        category: 'Creative',
        config: JSON.stringify(creativeConfig)
      },
      create: {
        name,
        category: 'Creative',
        layout: 'Split-Left',
        isPremium: false,
        config: JSON.stringify(creativeConfig)
      }
    })
  }

  // 4. Premium (7 themes)
  const premiumThemes = ['Nova', 'Vivid', 'Aurora', 'Crystal', 'Matrix', 'Orbit', 'Xenon']
  for (const name of premiumThemes) {
    await prisma.theme.upsert({
      where: { name },
      update: { 
        category: 'Premium',
        config: JSON.stringify(premiumConfig)
      },
      create: {
        name,
        category: 'Premium',
        layout: 'Split-Left',
        isPremium: true,
        config: JSON.stringify(premiumConfig)
      }
    })
  }

  // 5. Modern Collection (5 themes)
  const modernCollection = ['Glassmorphism', 'Neumorphism', 'Flat Design', 'Material You', 'Brutalist']
  for (const name of modernCollection) {
    await prisma.theme.upsert({
      where: { name },
      update: { 
        category: 'Modern Collection',
        config: JSON.stringify(modernConfig)
      },
      create: {
        name,
        category: 'Modern Collection',
        layout: 'Split-Left',
        isPremium: false,
        config: JSON.stringify(modernConfig)
      }
    })
  }

  // 6. Retro Collection (5 themes)
  const retroCollection = ['80s Neon', '90s Gradient', 'Y2K Metallic', 'Pixel Art', 'Vaporwave']
  for (const name of retroCollection) {
    await prisma.theme.upsert({
      where: { name },
      update: { 
        category: 'Retro Collection',
        config: JSON.stringify(retroConfig)
      },
      create: {
        name,
        category: 'Retro Collection',
        layout: 'Split-Right',
        isPremium: false,
        config: JSON.stringify(retroConfig)
      }
    })
  }

  // 7. Minimalist Collection (5 themes)
  const minimalistCollection = ['Monochrome', 'Line Art', 'Negative Space', 'Swiss Design', 'Japanese Zen']
  for (const name of minimalistCollection) {
    await prisma.theme.upsert({
      where: { name },
      update: { 
        category: 'Minimalist Collection',
        config: JSON.stringify(minimalistConfig)
      },
      create: {
        name,
        category: 'Minimalist Collection',
        layout: 'Centered',
        isPremium: false,
        config: JSON.stringify(minimalistConfig)
      }
    })
  }

  // 8. Corporate Collection (5 themes)
  const corporateCollection = ['Professional Blue', 'Healthcare Green', 'Finance Gold', 'Tech Startup', 'Government']
  for (const name of corporateCollection) {
    // Check if specific config exists, otherwise use generic corporate
    let config = corporateConfig
    if (name === 'Healthcare Green') {
      config = healthcareGreenConfig
    }

    await prisma.theme.upsert({
      where: { name },
      update: { 
        category: 'Corporate Collection',
        config: JSON.stringify(config)
      },
      create: {
        name,
        category: 'Corporate Collection',
        layout: 'Full-Bg',
        isPremium: false,
        config: JSON.stringify(config)
      }
    })
  }

  // 9. Creative Collection (5 themes)
  const creativeCollection = ['Artistic Brush', 'Watercolor', 'Geometric', 'Organic Shapes', 'Holographic']
  for (const name of creativeCollection) {
    await prisma.theme.upsert({
      where: { name },
      update: { 
        category: 'Creative Collection',
        config: JSON.stringify(creativeConfig)
      },
      create: {
        name,
        category: 'Creative Collection',
        layout: 'Split-Left',
        isPremium: true,
        config: JSON.stringify(creativeConfig)
      }
    })
  }

  // --- Seed Email Templates ---
  console.log('Seeding email templates...')
  
  await prisma.emailTemplate.upsert({
    where: { name: 'verification_email' },
    update: {},
    create: {
      name: 'verification_email',
      subject: 'Sign in to {{host}}',
      htmlContent: `
        <body style="background: #f9f9f9; padding: 20px; font-family: sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #333; margin-bottom: 20px;">Sign in to {{host}}</h1>
            <p style="color: #666; margin-bottom: 30px;">Click the button below to sign in. This link will expire in 24 hours.</p>
            <a href="{{url}}" style="display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Sign in</a>
            <p style="color: #999; font-size: 12px; margin-top: 40px;">If you didn't request this email, you can safely ignore it.</p>
          </div>
        </body>
      `,
      textContent: `Sign in to {{host}}\n{{url}}\n\n`
    }
  })

  await prisma.emailTemplate.upsert({
    where: { name: 'reset_password' },
    update: {},
    create: {
      name: 'reset_password',
      subject: 'Reset your password for {{host}}',
      htmlContent: `
        <body style="background: #f9f9f9; padding: 20px; font-family: sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #333; margin-bottom: 20px;">Reset Password</h1>
            <p style="color: #666; margin-bottom: 30px;">You requested to reset your password. Click the link below to proceed.</p>
            <a href="{{url}}" style="display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
            <p style="color: #999; font-size: 12px; margin-top: 40px;">If you didn't request this, please ignore this email.</p>
          </div>
        </body>
      `,
      textContent: `Reset your password: {{url}}\n\n`
    }
  })

  console.log('Seeding completed.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
