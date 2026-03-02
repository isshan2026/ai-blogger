/**
 * 記事の本文（Markdown形式）の適切な位置にアフィリエイトタグや定型文を挿入します。
 */

// サンプルのアフィリエイトHTMLタグ（ユーザーが後で自分のものに差し替える）
const AFFILIATE_TAG = `
<div style="padding: 24px; border: 1px solid rgba(0, 240, 255, 0.2); background-color: rgba(20, 20, 20, 0.6); text-align: center; margin: 40px 0; border-radius: 16px; backdrop-filter: blur(16px); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);">
  <p style="margin-bottom: 16px; font-weight: bold; color: #f0f0f0; letter-spacing: 0.05em;">💡 AIや最新テクノロジーを学ぶならこれ！</p>
  <a href="https://amazon.co.jp/" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(138, 43, 226, 0.1)); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 8px; color: #00f0ff; text-decoration: none; font-weight: bold; font-size: 0.9em;">
    おすすめの関連書籍・ツールをチェックする（Amazon）
  </a>
</div>
`;

export function insertAffiliateTags(bodyMarkdown: string): string {
  // 簡単なロジックとして、本文の末尾にアフィリエイトタグを追加する
  // ※ もし本文が長い場合は、中間（見出しの前など）に挿入するよう拡張可能

  const appendedBody = `${bodyMarkdown}\n\n---\n${AFFILIATE_TAG}\n`;

  return appendedBody;
}
