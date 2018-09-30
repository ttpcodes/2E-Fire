declare module 'koa-ejs' {
  export default function render (app: import ('koa'),
                                  { layout, root, viewExt }: { layout: string, root: string, viewExt: string }): null
}
