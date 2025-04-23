<template>
  <a-layout class="main-layout">
    <!-- 响应式头部 -->
    <a-layout-header class="header">
      <div class="nav-container">
        <div class="logo">My Blog</div>
        <a-button class="menu-trigger" type="text" @click="drawerVisible = true" v-show="isMobile">
          <menu-outlined />
        </a-button>
        <a-menu theme="dark" :mode="isMobile ? 'inline' : 'horizontal'" v-model:selectedKeys="currentMenu"
          :style="{ lineHeight: '64px', flex: 1 }" v-show="!isMobile">
          <a-menu-item key="1">首页</a-menu-item>
          <a-menu-item key="2">归档</a-menu-item>
          <a-menu-item key="3">关于</a-menu-item>
        </a-menu>
      </div>
    </a-layout-header>

    <!-- 移动端抽屉菜单 -->
    <a-drawer v-model:visible="drawerVisible" placement="left" :closable="false" width="200">
      <a-menu mode="inline" theme="dark" v-model:selectedKeys="currentMenu">
        <a-menu-item key="1">首页</a-menu-item>
        <a-menu-item key="2">归档</a-menu-item>
        <a-menu-item key="3">关于</a-menu-item>
      </a-menu>
    </a-drawer>

    <!-- 主要内容区域 -->
    <a-layout-content class="content">
      <div class="search-filter">
        <a-input-search v-model:value="searchText" placeholder="搜索文章..." enter-button @search="handleSearch"
          class="search-input" />
        <a-radio-group v-model:value="currentCategory" button-style="solid" class="category-filter">
          <a-radio-button value="">全部</a-radio-button>
          <a-radio-button v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </a-radio-button>
        </a-radio-group>
      </div>

      <div class="post-list">
        <a-card v-for="post in filteredPosts" :key="post.id" class="post-card" :hoverable="true"
          @click="handleCardClick(post)">
          <template #title>
            <div class="post-title">
              {{ post.title }}
              <a-tag v-for="tag in post.tags" :key="tag" color="blue" class="post-tag">
                {{ tag }}
              </a-tag>
            </div>
          </template>
          <template #extra>
            <span>{{ formatDate(post.date) }}</span>
          </template>
          <p class="post-excerpt">{{ post.excerpt }}</p>
          <div class="post-footer">
            <a-button type="link" @click.stop="handleLike(post)">
              <like-outlined :style="{ color: post.liked ? '#eb2f96' : '' }" />
              {{ post.likes }}
            </a-button>
            <a-button type="link" @click.stop="handleComment(post)">
              <message-outlined />
              {{ post.comments }}
            </a-button>
          </div>
        </a-card>
      </div>

      <!-- 分页 -->
      <a-pagination class="pagination" v-model:current="currentPage" :total="totalPosts" :page-size="pageSize"
        show-less-items @change="handlePageChange" />
    </a-layout-content>

    <!-- 底部 -->
    <a-layout-footer class="footer">
      © 2025 My Blog. All rights reserved.
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import {
  LikeOutlined,
  MessageOutlined,
  MenuOutlined
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

// 响应式处理
const isMobile = ref(false);
const drawerVisible = ref(false);

// 数据状态
const searchText = ref('');
const currentCategory = ref('');
const currentPage = ref(1);
const pageSize = ref(5);
const currentMenu = ref(['1']);

// 模拟博文数据
const posts = ref(Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  title: `文章标题 ${i + 1}`,
  date: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
  excerpt: `这是第 ${i + 1} 篇文章的内容摘要，包含一些示例文本用于演示布局和交互功能。文章内容可能涉及前端开发、响应式设计、Vue框架使用等主题。`,
  category: ['技术', '生活', '旅行'][i % 3],
  tags: ['Vue', '响应式', 'Web开发'].slice(0, i % 3 + 1),
  likes: Math.floor(Math.random() * 100),
  comments: Math.floor(Math.random() * 50),
  liked: false
})));

// 方法
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

// Interfaces
interface Post {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  liked: boolean;
}

// Computed properties
const categories = computed<string[]>(() => [...new Set(posts.value.map(p => p.category))]);
const totalPosts = computed<number>(() => posts.value.length);

const filteredPosts = computed<Post[]>(() => {
  return posts.value
    .filter(post => {
      const matchSearch = post.title.includes(searchText.value) ||
        post.excerpt.includes(searchText.value);
      const matchCategory = !currentCategory.value ||
        post.category === currentCategory.value;
      return matchSearch && matchCategory;
    })
    .slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

// Methods
const formatDate = (date: string): string => dayjs(date).format('YYYY年MM月DD日');

const handleLike = (post: Post): void => {
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
};

const handleComment = (post: Post): void => {
  console.log('跳转到评论:', post.id);
};

const handleCardClick = (post: Post): void => {
  console.log('查看详情:', post.id);
};

const handlePageChange = (page: number): void => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleSearch = (): void => {
  currentPage.value = 1;
};

// 生命周期
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
