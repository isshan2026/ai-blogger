import { GoogleGenAI } from '@google/genai';

// Next.js (App Router) サーバーサイドでのみ実行されることを前提にする
// 環境変数 GEMINI_API_KEY が必要

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface GeneratedContent {
    title: string;
    summary: string[];
    body: string;
}

/**
 * 英語の記事情報をGemini APIに投げて、ブログ用のタイトル・要約・本文を生成する
 */
export async function generateBlogArticle(englishTitle: string, englishContent: string): Promise<GeneratedContent | null> {
    const prompt = `
あなたは、読者に語りかけるような、親しみやすくてフランクな文章が得意な大人気のIT・AI系ブログライターです。
以下の「英語記事のタイトル」と「内容」を元に、日本の読者がワクワクして読みたくなるようなブログ記事を作成してください。

指示事項:
1. 日本語のキャッチーな「タイトル」をつけること（30文字前後）
2. 記事の「要約（結論）」を**必ず全体で100文字以内（短めの1〜2文）**で簡潔にまとめること。この要約文はそのままX（Twitter）のツイート本文に文字数制限の中で流れるため、長文は絶対NGです。「〜ですよね！」「〜らしいです！」のように短く目を引くフレンドリーな口調にすること。
3. 本文は、「背景」「詳細」「影響やまとめ」など見出しをつけて論理的に解説しつつも、読者に語りかけるような親しみやすい文体（絵文字なども適度に交える）で書くこと。
4. 専門用語はなるべく分かりやすく噛み砕いて、「つまり〜ってことです！」と例えるなど工夫すること。
5. 出力は必ず以下のJSON形式にすること。マークダウンやHTMLの装飾（\`\`\`json など）は**一切含めず**、純粋なJSON文字列だけを返すこと。特にsummaryはHTMLタグを含まないプレーンテキストの配列にすること。

{
  "title": "（キャッチーな日本語タイトル）",
  "summary": ["（要約ポイント1）", "（要約ポイント2）", "（要約ポイント3）"],
  "body": "（ブログ本文。適宜マークダウンの見出しや太字を使用）"
}

---
英語記事のタイトル: ${englishTitle}
内容:
${englishContent.substring(0, 3000)} // トークン節約のため最大3000文字に制限
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        if (response && response.text) {
            // AIの返却テキストをパース
            // JSON指定（responseMimeType: "application/json"）しているので、純粋なJSONが返ってくるはず
            const result: GeneratedContent = JSON.parse(response.text);
            return result;
        }
        return null;

    } catch (error) {
        console.error('Error in generateBlogArticle:', error);
        return null;
    }
}
