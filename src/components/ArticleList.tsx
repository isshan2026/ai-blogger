"use client";

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ChevronRight, ExternalLink, Calendar, Cpu, Sparkles } from 'lucide-react';

// Props型定義
type ArticleRecord = {
    id: string;
    title: string;
    summary: string[];
    originalLink: string;
    source: string;
    pubDate: string;
    createdAt: string;
};

export default function ArticleList({ articles }: { articles: ArticleRecord[] }) {
    // コンテナアニメーションの設定
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    };

    return (
        <main className="relative min-h-screen overflow-hidden selection:bg-cyan-500/30">
            {/* プレミアム背景アニメーション */}
            <div className="absolute inset-0 z-0 bg-gradient-animate pointer-events-none"></div>

            {/* ヒーローセクション */}
            <section className="relative z-10 pt-32 pb-20 px-4 md:px-8 text-center max-w-5xl mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border border-[rgba(0,240,255,0.2)] text-cyan-400 text-sm font-semibold uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                >
                    <Sparkles size={16} /> Premium Intelligence
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.1] text-white"
                >
                    Discover The <span className="text-gradient-accent">Future</span>
                    <br /> Before It Arrives
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl font-light mb-12"
                >
                    海外の最新AIトレンド、技術ニュース、最先端の研究論文を、
                    洗練されたAIが自動で翻訳・要約してお届けするエリート向けニュースハブ。
                </motion.p>
            </section>

            {/* 記事一覧セクション */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 pb-32">
                {articles.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 glass-panel rounded-3xl"
                    >
                        <Cpu className="mx-auto mb-4 text-gray-600" size={48} />
                        <h2 className="text-2xl font-medium text-gray-300 mb-2">Initialize Database...</h2>
                        <p className="text-gray-500">Cronジョブが実行されるか、/api/test にアクセスして記事を取得してください。</p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid gap-8"
                    >
                        {articles.map((article) => (
                            <motion.article
                                key={article.id}
                                variants={itemVariants}
                                className="group relative glass-panel rounded-3xl p-8 hover:border-[rgba(0,240,255,0.4)] transition-all duration-500 overflow-hidden"
                            >
                                {/* プレミアムなホバー時のグローエフェクト */}
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                                <div className="relative z-10">
                                    <div className="flex flex-wrap items-center gap-4 mb-6">
                                        <span className="bg-[#111] text-cyan-400 font-mono text-xs px-3 py-1.5 rounded-full border border-cyan-500/20 tracking-wider">
                                            {article.source.toUpperCase()}
                                        </span>
                                        <span className="flex items-center gap-1.5 font-mono text-xs text-gray-500">
                                            <Calendar size={14} />
                                            {new Date(article.pubDate).toLocaleDateString('ja-JP', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>

                                    <Link href={`/posts/${article.id}`} className="block">
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 group-hover:text-cyan-300 transition-colors duration-300 leading-snug">
                                            {article.title}
                                        </h2>
                                    </Link>

                                    <div className="space-y-3 mb-8">
                                        {article.summary.map((point, idx) => (
                                            <div key={idx} className="flex items-start text-gray-400 text-sm md:text-base leading-relaxed font-light">
                                                <span className="text-purple-500 mr-3 mt-1 text-xs">◆</span>
                                                <span>{point.replace(/<[^>]*>?/gm, '')}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 border-t border-white/5">
                                        <Link
                                            href={`/posts/${article.id}`}
                                            className="inline-flex items-center gap-2 text-cyan-400 font-medium hover:text-cyan-300 transition-colors group/btn"
                                        >
                                            Read Full Analysis
                                            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>

                                        <a
                                            href={article.originalLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-widest font-mono"
                                        >
                                            View Original Source <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                )}
            </section>
        </main>
    );
}
