# isomorph link vocabulary example

This example dogfoods a user-owned `.isomorph/framework/<framework-id>/` vocabulary.

It models a local link vocabulary that marks short OFM wikilinks as semantic loss, while allowing explicit path + alias links.

## Run

```sh
tmp=$(mktemp -d)
cp -R examples/isomorph-link-vocabulary/content "$tmp/content"
rtk apps/isomorph/dist/index.js --root "$tmp" init
cp -R examples/isomorph-link-vocabulary/.isomorph/framework "$tmp/.isomorph/framework"
rtk apps/isomorph/dist/index.js --root "$tmp" framework list
rtk apps/isomorph/dist/index.js --root "$tmp" recognize "$tmp/content/short-link.md" --json
rtk apps/isomorph/dist/index.js --root "$tmp" lint "$tmp/content/short-link.md" --json
rtk apps/isomorph/dist/index.js --root "$tmp" lint "$tmp/content/path-alias-link.md"
```

