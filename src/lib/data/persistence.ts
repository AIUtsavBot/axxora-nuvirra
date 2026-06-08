import type { NuvirraSeedData } from "@/types";

let fs: any = null;
let path: any = null;

if (typeof window === "undefined") {
  try {
    fs = require("fs");
    path = require("path");
  } catch (e) {
    // fs/path not available
  }
}

const getDbPath = () => {
  if (path) {
    // We save inside the src/lib/data folder so it persists nicely in local development
    return path.join(process.cwd(), "src/lib/data/db.json");
  }
  return "";
};

export function loadLocalDb(defaultData: NuvirraSeedData): NuvirraSeedData {
  if (typeof window !== "undefined" || !fs) {
    return defaultData;
  }

  const dbPath = getDbPath();
  if (!dbPath) return defaultData;

  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, "utf8");
      const parsed = JSON.parse(data);
      console.log("[Persistence] Loaded mock database successfully from local storage.");
      return parsed;
    }
  } catch (err) {
    console.error("[Persistence] Failed to read local db.json, using defaults.", err);
  }

  // If file doesn't exist, create it with defaults
  saveLocalDb(defaultData);
  return defaultData;
}

export function saveLocalDb(data: NuvirraSeedData) {
  if (typeof window !== "undefined" || !fs) {
    return;
  }

  const dbPath = getDbPath();
  if (!dbPath) return;

  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
    console.log("[Persistence] Mock database changes saved to local storage.");
  } catch (err: any) {
    // Wrap in try-catch so it fails gracefully on read-only environments like Vercel
    console.warn("[Persistence] Failed to write db.json (this is expected on read-only hosting like Vercel).", err.message);
  }
}

/**
 * Creates a recursive Proxy that intercepts all mutation operations
 * on the seedData object and its children arrays/objects, triggering auto-save.
 */
export function createPersistentProxy(target: any, onChange: () => void): any {
  const isObject = (val: any) => val && typeof val === "object";
  const proxyMap = new WeakMap();

  function makeProxy(val: any): any {
    if (!isObject(val)) return val;
    if (proxyMap.has(val)) return proxyMap.get(val);

    // Recursively proxy children
    for (const key of Object.keys(val)) {
      val[key] = makeProxy(val[key]);
    }

    const handler: ProxyHandler<any> = {
      set(target, prop, value, receiver) {
        const newValue = makeProxy(value);
        const result = Reflect.set(target, prop, newValue, receiver);
        onChange();
        return result;
      },
      deleteProperty(target, prop) {
        const result = Reflect.deleteProperty(target, prop);
        onChange();
        return result;
      },
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        // Intercept array mutation methods
        if (Array.isArray(target) && typeof value === "function") {
          const mutatingMethods = ["push", "pop", "shift", "unshift", "splice", "reverse", "sort"];
          if (mutatingMethods.includes(prop as string)) {
            return function (...args: any[]) {
              const proxiedArgs = args.map(makeProxy);
              const result = value.apply(target, proxiedArgs);
              onChange();
              return result;
            };
          }
        }
        return value;
      },
    };

    const proxy = new Proxy(val, handler);
    proxyMap.set(val, proxy);
    return proxy;
  }

  return makeProxy(target);
}
