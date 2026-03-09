# Workspace Analysis - Recycle-Fabrics

## **Workspace Overview**

### **Total Files**
- **15,765** TypeScript/JavaScript files (including node_modules)
- **17,719** total project files (including configs, assets, etc.)

### **File Categories**

#### **Core Application Files (Active)**
- **Frontend**: 55 files in `/src`
  - 8 main components (ImageUploader, ClassificationResult, etc.)
  - 40+ UI components from shadcn/ui
  - 3 pages (Index, NotFound)
  - Utility files and hooks

#### **Backend Files**
- **5 files** in `/backend` (excluding node_modules)
  - `server.js` - main server
  - `package.json` - dependencies
  - `README.md` - documentation
  - `render.yaml` - deployment config
  - `package-lock.json` - lock file

#### **Configuration Files**
- **15 config files** at root level
  - Multiple TypeScript configs (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`)
  - Build configs (`vite.config.ts`, `vitest.config.ts`)
  - Style configs (`tailwind.config.ts`, `postcss.config.js`)

### **Issues Identified**

#### **Duplicate Files**
- **Package manager conflicts**: Both `bun.lock` and `package-lock.json`
- **TypeScript configs**: 3 separate tsconfig files (could be consolidated)

#### **Unused Files**
- **40+ UI components**: Most shadcn/ui components appear unused based on import analysis
- **Pokemon-themed components**: `PokemonEmeraldBackground.tsx`, `PokemonEmeraldWalkthrough.tsx` seem unrelated to fabric recycling
- **Large media files**: `videoplayback.mp4` (potentially unused)

#### **Ignored Files**
- **node_modules**: Properly excluded (15,000+ dependency files)
- **Environment files**: `.env` files properly ignored
- **Build artifacts**: `dist/`, build logs

#### **Questionable Files**
- **Multiple lock files**: Indicates package manager switching
- **Extensive UI library**: 40+ Radix UI components for what appears to be a simple image classification app

### **File Usage Analysis**
Based on import patterns, only **~15%** of UI components are actively used. The core functionality uses:
- Image upload and classification components
- Basic UI elements (Button, Card, Input)
- Toast notifications and routing

### **Recommendations**
1. **Remove unused UI components** (could reduce bundle size by ~60%)
2. **Consolidate package managers** (choose npm or bun, not both)
3. **Merge TypeScript configs**
4. **Remove Pokemon-themed components**
5. **Audit large media files**

---

*Analysis generated on March 9, 2026*
