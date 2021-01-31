import React, { useState, useEffect } from "react";
import APISidebar from "./APISidebar";
import ReactMarkdown from "react-markdown";

const API = () => {
  const [docsToDisplay, setDocs] = useState("GettingStarted");
  const [markdown, setMarkdown] = useState("");
  useEffect(() => {
    fetchContent();
  }, [docsToDisplay]);

  const fetchContent = async () => {
    const MarkdownContent = await import(`./Docs/${docsToDisplay}.md`);
    const res = await fetch(MarkdownContent.default);
    const text = await res.text();
    setMarkdown(text);
  };

  const handleImageTransform = (uri) => {
    if (uri.startsWith("http")) {
      return uri;
    } else {
      const image = require(`./${uri}`);
      return image.default;
    }
  };

  return (
    <div className="docs">
      <div className="docs-sidebar">
        <APISidebar docsToDisplay={docsToDisplay} setDocs={setDocs} />
      </div>
      <div className="docs-main">
        <ReactMarkdown
          className="markdown-content"
          transformImageUri={handleImageTransform}
          // renderers={{
          //   link: handleProps,
          // }}
          options={{ tables: true, emoji: true }}
          source={markdown}
          allowDangerousHtml={true}
        />
      </div>
    </div>
  );
};

export default API;
