## error in production, not in dev

There is an error in the production minified version of the app

### production mode error

```
next build
next start
```

Loading index.tsx in browser produces error

```
index-71f057e0ed448a3d.js:1 SyntaxError: Unexpected token '{'
    at eval (eval at e.exports.runInThisContext (381-ece9bef8390c6cd3.js:1:19120), <anonymous>:3:13)
    at e.exports.runInThisContext (381-ece9bef8390c6cd3.js:1:19167)
    at d.compile (381-ece9bef8390c6cd3.js:1:5179)
    at d.parse (381-ece9bef8390c6cd3.js:1:5910)
    at P (381-ece9bef8390c6cd3.js:1:25743)
    at ec.readBlockHeader (381-ece9bef8390c6cd3.js:1:53537)
    at async ec.readBlock (381-ece9bef8390c6cd3.js:1:58061)
    at async ec.getContainerById (381-ece9bef8390c6cd3.js:1:52554)
    at async ec.getSamHeader (381-ece9bef8390c6cd3.js:1:51696)
```

comes from a chunk being eval'd

This is not a super-stripped down reproducible use case, but comes from our modules @gmod/cram https://github.com/GMOD/cram-js/ specifically this file https://github.com/GMOD/cram-js/blob/master/src/cramFile/file.ts

the chunk that fails to eval is below here, specifically "formatter(e){let t"

```
(function(buffer, constructorFn, Long) { if (!Buffer.isBuffer(buffer)) {
throw new Error("argument buffer is not a Buffer object");
}
var offset = 0;
var vars = {};
vars.compressionMethod = buffer.readUInt8(offset);
offset += 1;
vars.compressionMethod = (formatter(e){let t=["raw","gzip","bzip2","lzma","rans","rans4x16","arith","fqzcomp","tok3"][e];if(!t)throw Error(`compression method number ${e} not implemented`);return t}).call(this, vars.compressionMethod);
vars.contentType = buffer.readUInt8(offset);
offset += 1;
vars.contentType = (formatter(e){let t=["FILE_HEADER","COMPRESSION_HEADER","MAPPED_SLICE_HEADER","UNMAPPED_SLICE_HEADER","EXTERNAL_DATA","CORE_DATA"][e];if(!t)throw Error(`invalid block content type id ${e}`);return t}).call(this, vars.contentType);

    var $tmp0 = buffer[offset];
    if ($tmp0 < 0x80) {
      vars.contentId = $tmp0;
      offset += 1;
    } else if ($tmp0 < 0xc0) {
      vars.contentId = (($tmp0<<8) | buffer[offset+1]) & 0x3fff;
      offset += 2;
    } else if ($tmp0 < 0xe0) {
      vars.contentId = (($tmp0<<16) | (buffer[offset+1]<< 8) |  buffer[offset+2]) & 0x1fffff;
      offset += 3;
    } else if ($tmp0 < 0xf0) {
      vars.contentId = (($tmp0<<24) | (buffer[offset+1]<<16) | (buffer[offset+2]<<8) | buffer[offset+3]) & 0x0fffffff;
      offset += 4
    } else {
      vars.contentId = (($tmp0 & 0x0f)<<28) | (buffer[offset+1]<<20) | (buffer[offset+2]<<12) | (buffer[offset+3]<<4) | (buffer[offset+4] & 0x0f);
      // x=((0xff & 0x0f)<<28) | (0xff<<20) | (0xff<<12) | (0xff<<4) | (0x0f & 0x0f);
      // TODO *val_p = uv < 0x80000000UL ? uv : -((int32_t) (0xffffffffUL - uv)) - 1;
      offset += 5
    }


    var $tmp1 = buffer[offset];
    if ($tmp1 < 0x80) {
      vars.compressedSize = $tmp1;
      offset += 1;
    } else if ($tmp1 < 0xc0) {
      vars.compressedSize = (($tmp1<<8) | buffer[offset+1]) & 0x3fff;
      offset += 2;
    } else if ($tmp1 < 0xe0) {
      vars.compressedSize = (($tmp1<<16) | (buffer[offset+1]<< 8) |  buffer[offset+2]) & 0x1fffff;
      offset += 3;
    } else if ($tmp1 < 0xf0) {
      vars.compressedSize = (($tmp1<<24) | (buffer[offset+1]<<16) | (buffer[offset+2]<<8) | buffer[offset+3]) & 0x0fffffff;
      offset += 4
    } else {
      vars.compressedSize = (($tmp1 & 0x0f)<<28) | (buffer[offset+1]<<20) | (buffer[offset+2]<<12) | (buffer[offset+3]<<4) | (buffer[offset+4] & 0x0f);
      // x=((0xff & 0x0f)<<28) | (0xff<<20) | (0xff<<12) | (0xff<<4) | (0x0f & 0x0f);
      // TODO *val_p = uv < 0x80000000UL ? uv : -((int32_t) (0xffffffffUL - uv)) - 1;
      offset += 5
    }


    var $tmp2 = buffer[offset];
    if ($tmp2 < 0x80) {
      vars.uncompressedSize = $tmp2;
      offset += 1;
    } else if ($tmp2 < 0xc0) {
      vars.uncompressedSize = (($tmp2<<8) | buffer[offset+1]) & 0x3fff;
      offset += 2;
    } else if ($tmp2 < 0xe0) {
      vars.uncompressedSize = (($tmp2<<16) | (buffer[offset+1]<< 8) |  buffer[offset+2]) & 0x1fffff;
      offset += 3;
    } else if ($tmp2 < 0xf0) {
      vars.uncompressedSize = (($tmp2<<24) | (buffer[offset+1]<<16) | (buffer[offset+2]<<8) | buffer[offset+3]) & 0x0fffffff;
      offset += 4
    } else {
      vars.uncompressedSize = (($tmp2 & 0x0f)<<28) | (buffer[offset+1]<<20) | (buffer[offset+2]<<12) | (buffer[offset+3]<<4) | (buffer[offset+4] & 0x0f);
      // x=((0xff & 0x0f)<<28) | (0xff<<20) | (0xff<<12) | (0xff<<4) | (0x0f & 0x0f);
      // TODO *val_p = uv < 0x80000000UL ? uv : -((int32_t) (0xffffffffUL - uv)) - 1;
      offset += 5
    }

return { offset: offset, result: vars };
return { offset: offset, result: vars };
 })
```

can see in https://esprima.org/demo/validate.html that this is syntactically invalid

### dev mode works

```
next dev
```
