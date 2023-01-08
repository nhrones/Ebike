
export function toPascalCase(text: string): string {
    return text.replace(
        /(^\w|-\w)/g,
        (substring) => substring.replace(/-/, "").toUpperCase(),
    );
}

export function sanitizeName(name: string): string {
    const fileName = name.replace("/", "");
    return toPascalCase(fileName);
}

import { resolve, extname, join, toFileUrl } from "https://deno.land/std@0.170.0/path/mod.ts";

interface Manifest { widgets: string[]; }

export async function collect(directory: string): Promise<Manifest> {

    const widgetsDir = join(directory, "./Widgets");

    const widgets = [];
    try {
        const widgetsUrl = toFileUrl(widgetsDir);
        for await (const entry of Deno.readDir(widgetsDir)) {
            if (entry.isDirectory) {
                console.error(
                    `Found subdirectory '${entry.name}' in Widgets/. The Widgets/ folder must not contain any subdirectories.`,
                );
            }
            if (entry.isFile) {
                const ext = extname(entry.name);
                if (![".ts", ".js"].includes(ext)) continue;
                const path = join(widgetsDir, entry.name);
                const file = toFileUrl(path).href.substring(widgetsUrl.href.length);
                widgets.push(file);
            }
        }
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            // Do nothing.
        } else {
            throw err;
        }
    }
    widgets.sort();
console.info(widgets)
    return { widgets, };
}

export async function generate(directory: string, manifest: Manifest) {
    const { widgets } = manifest;

    const output = `// DO NOT EDIT.
// This file is automatically updated during startup.

${widgets.map((file, i) => `import * as $${i} from "./Widgets${file}";`)
            .join("\n")
        }

const manifest = {
  widgets: {
    ${widgets.map((file, i) => `${JSON.stringify(`./Widgets${file}`)}: $${i},`)
            .join("\n    ")
        }
  },
  baseUrl: import.meta.url,
};

export default manifest;
`;

    const proc = Deno.run({
        cmd: [Deno.execPath(), "fmt", "-"],
        stdin: "piped",
        stdout: "piped",
        stderr: "null",
    });
    const raw = new ReadableStream({
        start(controller) {
            controller.enqueue(new TextEncoder().encode(output));
            controller.close();
        },
    });
    await raw.pipeTo(proc.stdin.writable);
    const out = await proc.output();
    await proc.status();
    proc.close();

    const manifestStr = new TextDecoder().decode(out);
    const manifestPath = join(directory, './widget_manifest.ts');

    await Deno.writeTextFile(manifestPath, manifestStr);
    console.log(
        `%cThe manifest has been generated for ${widgets.length} widgets.`,
        "color: blue; font-weight: bold",
    );
}

const widgets: Map<string, any> = new Map()

// Get the manifest' base URL.
const baseUrl = new URL("./", import.meta.url).href //manifest.baseUrl).href;

const unresolvedDirectory = './';
const resolvedDirectory = resolve(unresolvedDirectory);

const manifest2 = await collect(resolvedDirectory);
await generate(resolvedDirectory, manifest2);
