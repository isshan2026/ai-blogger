"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, LayoutGrid, Award, Globe, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import type { ArticleRecord } from '@/lib/db';

export default function ArticleDetail({ article }: { article: ArticleRecord }) {
    return (
        <main className="relative min-h-screen bg-[#050505] overflow-hidden">
            {/* プレミアム背景アニメーション */}
            <div className="fixed inset-0 z-0 bg-gradient-animate pointer-events-none opacity-50"></div>

            {/* ナビゲーション */}
            <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 border-t-0 border-x-0 rounded-none">
                <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm font-medium uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Hub
                    </Link>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-xs font-bold uppercase tracking-widest">
                        AI & Tech Insights
                    </span>
                </div>
            </nav>

            {/* 記事コンテンツ */}
            <article className="relative z-10 max-w-3xl mx-auto px-4 pt-32 pb-24">
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <div className="flex justify-center items-center gap-3 mb-6">
                        <span className="bg-[#111] text-purple-400 font-mono text-xs px-3 py-1.5 rounded-full border border-purple-500/20 tracking-wider inline-flex items-center gap-1.5">
                            <Globe size={12} /> {article.source.toUpperCase()}
                        </span>
                        <span className="bg-[#111] text-gray-400 font-mono text-xs px-3 py-1.5 rounded-full border border-white/10 tracking-wider inline-flex items-center gap-1.5">
                            <Clock size={12} />
                            {new Date(article.createdAt).toLocaleDateString('ja-JP')}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] mb-8 drop-shadow-sm">
                        {article.title}
                    </h1>

                    <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto rounded-full"></div>
                </motion.header>

                {/* 要約ハイライト: ガラスモーフィズム枠 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="glass-panel rounded-2xl p-6 md:p-8 mb-16 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-l-4 border-l-cyan-400"
                >
                    <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Award className="text-cyan-400" size={18} /> Executive Summary
                    </h2>
                    <div className="space-y-4">
                        {article.summary.map((point, i) => (
                            <div key={i} className="flex items-start text-gray-300 text-base md:text-lg font-light leading-relaxed">
                                <span className="text-cyan-500 mr-3 mt-1">✓</span>
                                <span>{point.replace(/<[^>]*>?/gm, '')}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* マークダウン本文 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="prose prose-lg prose-invert max-w-none 
           prose-headings:font-bold prose-headings:text-gray-100 prose-headings:tracking-tight 
           prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
           prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
           prose-img:rounded-2xl prose-img:border-2 prose-img:border-white/10 prose-img:shadow-2xl
           prose-p:font-light prose-p:leading-relaxed prose-p:text-gray-300
           prose-li:text-gray-300 prose-li:font-light"
                >
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {article.body}
                    </ReactMarkdown>
                </motion.div>

                {/* フッターアクション */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-mono uppercase tracking-widest">
                        <LayoutGrid size={14} /> AI Generated & Curated
                    </div>

                    <a
                        href={article.originalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-300 bg-transparent rounded-full border border-cyan-500 overflow-hidden"
                    >
                        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-cyan-500"></span>
                        <span className="relative flex items-center gap-2 tracking-widest uppercase text-xs">
                            View Original Source <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </span>
                    </a>
                </motion.footer>
            </article>
        </main>
    );
}
