import { createPreview } from 'shaders/js'

const preview = await createPreview(
  document.getElementById("canvas"),
  { shader: "0b39490b-d41e-4cd1-bf15-8b65e989d106" }
)