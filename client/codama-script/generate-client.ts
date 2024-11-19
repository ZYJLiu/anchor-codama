// npx esrun codama-script/generate-client.ts
// script to generate the codama client sdks from the anchor idl
// this generates both the js and rust sdks, but we are only using the js sdk
import { createFromRoot, updateProgramsVisitor } from "codama";
import { AnchorIdl, rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { renderVisitor as renderJavaScriptVisitor } from "@codama/renderers-js";
import { renderVisitor as renderRustVisitor } from "@codama/renderers-rust";
import anchorIdl from "./counter_program.json";

const rootNode = rootNodeFromAnchor(anchorIdl as AnchorIdl);
const codama = createFromRoot(rootNode);
codama.update(
  updateProgramsVisitor({
    counterProgram: { name: "counter" },
  })
);

// Generate the client sdks at the given path
codama.accept(renderJavaScriptVisitor("./codama-sdks/js/src/generated"));
codama.accept(renderRustVisitor("./codama-sdks/rust/src/generated"));
