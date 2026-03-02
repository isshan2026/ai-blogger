import { TwitterApi } from 'twitter-api-v2';

// 必須の環境変数が設定されているか確認
const isTwitterConfigured =
    process.env.TWITTER_API_KEY &&
    process.env.TWITTER_API_SECRET &&
    process.env.TWITTER_ACCESS_TOKEN &&
    process.env.TWITTER_ACCESS_SECRET;

const client = isTwitterConfigured ? new TwitterApi({
    appKey: process.env.TWITTER_API_KEY as string,
    appSecret: process.env.TWITTER_API_SECRET as string,
    accessToken: process.env.TWITTER_ACCESS_TOKEN as string,
    accessSecret: process.env.TWITTER_ACCESS_SECRET as string,
}) : null;

const readWriteClient = client?.readWrite;

/**
 * ブログ記事の公開を知らせる自動ツイートを送信します
 * @param title 記事のタイトル
 * @param summary 記事の要約（配列の1つ目などを使う）
 * @param postUrl ブログ記事へのリンクURL
 */
export async function postToX(title: string, summary: string, postUrl: string) {
    if (!readWriteClient) {
        console.warn("Twitter API keys are not configured. Skipping X post.");
        return;
    }

    try {
        // ツイート文面の作成 (Xの制限140文字/280文字に配慮)
        const tweetText = `【新着AIニュース🚀】\n\n${title}\n\n💡 ${summary.substring(0, 50)}...\n\n詳細はこちら👉 ${postUrl}\n\n#AI #テクノロジー #最新ニュース`;

        const { data: createdTweet } = await readWriteClient.v2.tweet(tweetText);
        console.log(`Successfully posted to X: ${createdTweet.id}`);
        return createdTweet;
    } catch (error) {
        console.error("Failed to post to X:", error);
        throw error;
    }
}
