export function getTutorialContent(): string {
  return `
<h1>🎉 Bem-vindo ao Editor de Documentos!</h1>

<p>Este é um tutorial rápido para você aprender a usar todas as funcionalidades do editor.</p>

<h2>📝 Funcionalidades Básicas</h2>

<ul>
  <li><strong>Digite normalmente</strong> para criar conteúdo</li>
  <li><strong>Ctrl + B</strong> - Texto em negrito</li>
  <li><strong>Ctrl + I</strong> - Texto em itálico</li>
  <li><strong>Ctrl + K</strong> - Adicionar link</li>
  <li><strong>Ctrl + Shift + 7</strong> - Lista numerada</li>
  <li><strong>Ctrl + Shift + 8</strong> - Lista com marcadores</li>
</ul>

<h2>🎨 Formatação Avançada</h2>

<h3>Títulos</h3>
<p>Use # para h1, ## para h2, ### para h3, etc.</p>

<h3>Código</h3>
<pre><code>// Use crases para código inline
function exemplo() {
  return "Hello World!";
}</code></pre>

<h3>Citações</h3>
<blockquote>Use > para citações como esta</blockquote>

<h2>💾 Gerenciamento de Documentos</h2>

<ul>
  <li><strong>Ctrl + N</strong> - Novo documento</li>
  <li><strong>Ctrl + S</strong> - Salvar documento</li>
  <li><strong>Ctrl + D</strong> - Favoritar/Desfavoritar</li>
  <li><strong>Ctrl + F</strong> - Buscar em documentos</li>
</ul>

<h2>📤 Compartilhamento</h2>

<p>Compartilhe seus documentos com até 10 pessoas por email diretamente pelo editor!</p>

<h2>⚡ Atalhos Rápidos</h2>

<ul>
  <li><strong>Ctrl + /</strong> - Ver todos os atalhos</li>
  <li><strong>Ctrl + Shift + E</strong> - Compartilhar documento</li>
  <li><strong>Tab</strong> - Indentar em listas</li>
  <li><strong>Shift + Tab</strong> - Remover indentação</li>
</ul>

<hr>

<h3>🎯 Dica Importante</h3>

<p>Seu trabalho é salvo automaticamente a cada alteração. Não se preocupe em perder conteúdo!</p>

<div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
  <strong>💡 Pronto para começar?</strong>
  <p>Você pode editar este documento para praticar ou criar um novo documento usando <kbd>Ctrl + N</kbd>.</p>
  <p>Quando estiver pronto, feche este tutorial e comece a criar!</p>
</div>

<p style="text-align: center; color: #666; margin-top: 30px;">
  <em>Este tutorial some automaticamente após ser lido 😊</em>
</p>
  `.trim();
}