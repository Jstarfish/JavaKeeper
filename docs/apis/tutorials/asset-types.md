# Asset Types

When you create assets on a temporal data object (TDO), you are required to specify a `type`.
aiWARE supports the following values for the `type` field:

| Type | Meaning |
| ---- | ------- |
| `media` | Used for anything that’s a file that could be processed. A TDO can have more than one `media` asset to represent various copies of the file or ancillary versions of the original file. When a TDO is processed, the asset that will be used for processing is determined by which of the `media` assets is identified as the `primaryMedia(type: "asset")`. |
| `vtn-standard` | Used for engine output documents. See the [engine output standard](/developer/engines/standards/engine-output/) section for information. |
| `thumbnail` | Used for storing lower-resolution image thumbnail previews of media files.  The default thumbnail that is displayed in CMS and other apps is based on the value of the TDO's `thumbnailUrl` property. |
| `content-template` | TDO content templates are extra metadata appended to a TDO. The contents of each `content-template` asset will conform to a particular schema designated by `asset.sourceData.schema`. |
| `transcript` | A legacy asset type used for storing TTML transcripts. Do not use this type; use `vtn-standard` instead. |

## Custom Asset Types

You can define your own custom asset types by simply writing an asset with a type value beginning with `x-` (e.g. `x-my-asset-type`).
This will allow you to save asset types specific to your custom workflows and applications.
No special handling will be applied to assets whose type begins with `x-`.

## Reading Assets

While it is sometimes necessary to read asset metadata through the [assets] query and access the asset contents directly by downloading the file present at the asset's `signedUri`,
more often you will want to use higher-level APIs to access the information stored in assets.

- For accessing **audio and video media**, the signedUri returned for the primary media asset is often a reference to our `media-streamer`,
our DASH/HLS-compatible media streaming service that can be used to clip and stitch files and streams.
- For accessing **engine output**, use the [engineResults](/apis/reference/query/?id=engineresults) query.
It normalizes multiple versions of engine output to our most recent standard and can retrieve time-based sections of content.
- For accessing **thumbnails**, use the `temporalDataObject.thumbnail` property, which will return a signed URI.
