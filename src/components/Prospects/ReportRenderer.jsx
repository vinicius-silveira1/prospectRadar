import React from 'react';

const ReportRenderer = ({ data }) => {
  if (!data || !data.blocks || data.blocks.length === 0) {
    return <p className="italic text-slate-500 dark:text-slate-400">Esta análise ainda não tem conteúdo.</p>;
  }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {data.blocks.map((block) => {
        switch (block.type) {
          case 'header':
            // O Editor.js usa `level` para H1, H2, etc.
            const Tag = `h${block.data.level}`;
            return <Tag key={block.id} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
          
          case 'paragraph':
            return <p key={block.id} dangerouslySetInnerHTML={{ __html: block.data.text }} />;

          case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={block.id} className="list-disc list-inside">
                {block.data.items.map((item, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ListTag>
            );

          default:
            return <p key={block.id}>Bloco de tipo não suportado: {block.type}</p>;
        }
      })}
    </div>
  );
};

export default ReportRenderer;