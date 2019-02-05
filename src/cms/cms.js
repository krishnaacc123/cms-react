import CMS from 'netlify-cms';
import React from "react";
import { 
	setupPreview,
	Callout,
	Code,
	SmallCode,
	h1,
	h2,
	h3,
	ol,
	DescList,
	Link,
	Codeplay,
	Video,
	Codes } from './input';

const TextControl = CMS.getWidget("text").control;

CMS.registerPreviewStyle("./style.css");
CMS.registerPreviewStyle("./prism.css");
CMS.registerPreviewStyle("https://fonts.googleapis.com/css?family=Hind:400");

CMS.registerWidget(
  'mdx',
  TextControl,
  setupPreview({
    components: {
      h1: h1,
      h2: h2,
      h3: h3,
      ol: ol
    },
    scope: {
      Callout: Callout,
      Code: Code,
      SmallCode: SmallCode,
      DescList: DescList,
      Link: Link,
      Codeplay: Codeplay,
      Video: Video,
      Codes: Codes
    }
  })
);
