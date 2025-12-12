-- MySQL dump 10.13  Distrib 8.1.0, for Linux (aarch64)
--
-- Host: localhost    Database: interview
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Interview`
--

DROP TABLE IF EXISTS `Interview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Interview` (
  `id` int NOT NULL AUTO_INCREMENT,
  `interview_id` varchar(191) NOT NULL,
  `question_id` int NOT NULL,
  `answer_path` varchar(191) NOT NULL,
  `raw_answer` text,
  `refined_answer` text,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `newData` varchar(191) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Interview_question_id_fkey` (`question_id`),
  CONSTRAINT `Interview_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Interview`
--

LOCK TABLES `Interview` WRITE;
/*!40000 ALTER TABLE `Interview` DISABLE KEYS */;
INSERT INTO `Interview` VALUES (1,'20250912222400',3,'/interview/6498.mp3','1111','','2025-09-12 22:24:00.000',NULL,NULL),(2,'20250912222400',1,'/interview/6498.mp3','654894','','2025-09-12 16:19:41.000',NULL,NULL),(9,'20250913172646',1,'http://localhost:3000/answer/1757755642724-318486.mp3','使用不同的数据进行smgssr正常的是csr对于不同的数据回答结束','','2025-09-13 09:27:22.000',NULL,NULL),(10,'20250913172646',2,'http://localhost:3000/answer/1757755642978-667163.mp3','使用不同的数据进行smgssr正常的是csr对于不同的数据回答结束','','2025-09-13 09:27:22.000',NULL,NULL),(11,'20250913172646',2,'http://localhost:3000/answer/1757755675151-679435.mp3','事件循环机子是浏览器请求一个HR没有页面进行URL请求然后对于或许到HR没有页面之后取到一个下载JS文件下载不同的数据等等回答结束','','2025-09-13 09:27:55.000',NULL,NULL),(12,'20250913172646',3,'http://localhost:3000/answer/1757755675417-45575.mp3','事件循环机子是浏览器请求一个HR没有页面进行URL请求然后对于或许到HR没有页面之后取到一个下载JS文件下载不同的数据等等回答结束','','2025-09-13 09:27:55.000',NULL,NULL),(13,'20250913173831',1,'http://localhost:3000/answer/1757756336300-617949.webm','对于守平加载的话可以使用S sr然后使用SSG然后进行分页对于前端的话也可以进行一个主见南家宅的方法我的回答到此结束回答结束','','2025-09-13 09:38:56.000',NULL,NULL),(14,'20250913173831',2,'http://localhost:3000/answer/1757756336538-333060.webm','对于守平加载的话可以使用S sr然后使用SSG然后进行分页对于前端的话也可以进行一个主见南家宅的方法我的回答到此结束回答结束','','2025-09-13 09:38:56.000',NULL,NULL),(15,'20250913173831',2,'http://localhost:3000/answer/1757756348758-875690.webm','浏览器的事件循环机制式属于不同的数据使用不同的什么方法我的回答结束','','2025-09-13 09:39:08.000',NULL,NULL),(16,'20250913173831',3,'http://localhost:3000/answer/1757756349022-621855.webm','浏览器的事件循环机制式属于不同的数据使用不同的什么方法我的回答结束','','2025-09-13 09:39:09.000',NULL,NULL),(17,'20250913173831',3,'http://localhost:3000/answer/1757756369457-113493.webm','跨越文体的话使用sr进行后段配置然后前面发送一个新型球进行数据库里回答结束','','2025-09-13 09:39:29.000',NULL,NULL),(18,'20250913174255',1,'http://localhost:3000/answer/1757756585486-22890.webm','使用不同的数据机的车回答结束','','2025-09-13 09:43:05.000',NULL,NULL),(19,'20250913174255',2,'http://localhost:3000/answer/1757756585749-264758.webm','使用不同的数据机的车回答结束','','2025-09-13 09:43:05.000',NULL,NULL),(20,'20250913174255',2,'http://localhost:3000/answer/1757756592960-899409.webm','使用不同的数据机的车回答结束大结束回答结束','','2025-09-13 09:43:12.000',NULL,NULL),(21,'20250913174255',3,'http://localhost:3000/answer/1757756593203-253499.webm','大结束回答结束','','2025-09-13 09:43:13.000',NULL,NULL),(22,'20250913174655',1,'http://localhost:3000/answer/1757756825531-679674.webm','结束回答结束','','2025-09-13 09:47:05.000',NULL,NULL),(23,'20250913174655',2,'http://localhost:3000/answer/1757756825756-609412.webm','结束回答结束','','2025-09-13 09:47:05.000',NULL,NULL),(24,'20250913174655',2,'http://localhost:3000/answer/1757756835727-310728.webm','丢冷气循环机是巴拉巴拉巴拉巴拉回答结束','','2025-09-13 09:47:15.000',NULL,NULL),(25,'20250913174655',3,'http://localhost:3000/answer/1757756835962-396327.webm','丢冷气循环机是巴拉巴拉巴拉巴拉回答结束','','2025-09-13 09:47:15.000',NULL,NULL),(26,'20250913174655',3,'http://localhost:3000/answer/1757756853088-439127.webm','跨越文体的解决使用巴拉巴拉巴拉回答结束','','2025-09-13 09:47:33.000',NULL,NULL),(27,'20250913175025',1,'http://localhost:3000/answer/1757757058308-503297.webm','使用不同的页面回答结束','','2025-09-13 09:51:03.000',NULL,NULL),(28,'20250913175332',1,'http://localhost:3000/answer/1757757233395-989041.webm','处理不同的数据回答结束','','2025-09-13 09:53:57.000',NULL,NULL),(29,'20250913175332',2,'http://localhost:3000/answer/1757757248005-421571.webm','处理不同的数据回答结束','','2025-09-13 09:54:11.000',NULL,NULL),(32,'20251011090659',20,'http://localhost:3000/answer/1760144916654-46868.webm','','','2025-10-11 01:08:36.000',NULL,NULL),(33,'20251011090659',15,'http://localhost:3000/answer/1760145054789-573453.webm','','','2025-10-11 01:10:54.000',NULL,NULL),(34,'20251011090659',2,'http://localhost:3000/answer/1760145130068-741530.webm','','','2025-10-11 01:12:10.000',NULL,NULL),(35,'20251011090659',1,'http://localhost:3000/answer/1760145248719-867762.webm','','','2025-10-11 01:14:08.000',NULL,NULL),(36,'20251011090659',18,'http://localhost:3000/answer/1760145461809-418012.webm','','','2025-10-11 01:17:41.000',NULL,NULL),(37,'20251011090659',16,'http://localhost:3000/answer/1760145688417-647049.webm','','','2025-10-11 01:21:28.000',NULL,NULL),(38,'20251011090659',8,'http://localhost:3000/answer/1760145712176-91673.webm','','','2025-10-11 01:21:52.000',NULL,NULL),(39,'20251011090659',10,'http://localhost:3000/answer/1760145819259-12371.webm','','','2025-10-11 01:23:39.000',NULL,NULL),(40,'20251011090659',4,'http://localhost:3000/answer/1760145985559-181237.webm','','','2025-10-11 01:26:25.000',NULL,NULL),(41,'20251011090659',7,'http://localhost:3000/answer/1760145995844-795041.webm','','','2025-10-11 01:26:35.000',NULL,NULL),(42,'20251011090659',9,'http://localhost:3000/answer/1760146074052-476066.webm','','','2025-10-11 01:27:54.000',NULL,NULL);
/*!40000 ALTER TABLE `Interview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Question`
--

DROP TABLE IF EXISTS `Question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `type` int NOT NULL COMMENT '(1-简历面试，2-面试提问，3-vue面试题，4-前端热门面试，5-全部面试题，0-自我介绍)',
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Question`
--

LOCK TABLES `Question` WRITE;
/*!40000 ALTER TABLE `Question` DISABLE KEYS */;
INSERT INTO `Question` VALUES (1,'2025-09-12 22:24:00.000','首屏加载优化方法','按需加载数据，异步路由，SSR服务器渲染，代码分割，实用CDN，分页',1,NULL),(2,'2025-09-12 22:24:00.000','浏览器的事件循环机制是什么','因为javascript是单线程的，需要通过事件循环机制来出来同步任务和异步任务之间的关系，避免阻塞。机制是：先调用栈中的同步任务，然后处理微任务队列，在处理宏任务队列，处理完以后再清空一次微任务队列，处理完以后在进行循环处理',1,NULL),(3,'2025-09-12 22:24:00.000','跨域问题解决','服务端在响应头加上： Access-Control-Allow-Origin: https://example.com Access-Control-Allow-Methods: GET, POST, PUT, DELETE Access-Control-Allow-Headers: Content-Type, Authorization 2.JsonP 利用 <script> 标签不受同源策略限制，通过回调函数传递数据。 3.代理转发,在Vite里面配置，让前端请求转发到后端 4.反向代理 5.WebSocket',1,NULL),(4,'2025-09-16 08:13:53.000','什么是dom,什么是bom','dom是文档对象模型，bom是浏览器对象模型',2,NULL),(5,'2025-09-16 08:38:45.000','什么是CSRF和XSS?你在项目里面是如何解决的?','XSS 是向代码中植入恶意脚本，当脚本执行是窃取信息。有存储型，反射型，dom型 解决方法：对前端传的数据，不管是URL里面还是输入框的数据都不相信，对其做转译或者过滤处理 CSRF 是在已经登录的浏览器上，创造一个恶意请求，在请求的时候自动带上浏览器上的Cookie请求 解决方法：使用CSRF Token验证，设置Cookie的SameSite script/lax 让跨站不带Cookie或者限制Get不自动携带',2,NULL),(6,'2025-09-16 08:49:45.000','http1和http1.1 有什么区别，http2和http3的区别','HTTP/1.0：使用短连接，每次请求都要重新建立 TCP 连接（三次握手 + 请求），效率比较低。 HTTP/1.1：默认启用长连接（keep-alive），一个 TCP 连接可以复用多个请求，但因为响应必须按顺序返回，依旧存在队头阻塞。 HTTP/2：引入二进制分帧和多路复用，可以在同一个 TCP 连接里并发多个请求，头部也做了 HPACK 压缩，性能提升明显。但它仍然基于 TCP，如果底层丢包，还是会阻塞整个连接。 HTTP/3：基于 QUIC 协议（UDP + TLS 1.3），彻底解决了 TCP 的队头阻塞，同时握手更快（1-RTT/0-RTT），安全性也更强。',2,NULL),(7,'2025-09-16 08:49:45.000','for循环中的key 有什么作用，你使用它做过什么','核心作用  “key 的主要作用是给 Vue 一个唯一的标识，用于跟踪每个节点的身份，从而在列表更新时能够高效地复用和重新排序现有的元素。 它的终极目的是为了提升性能并避免渲染错误。” 没有key在vue 更新的时候触发就地更新，在有key的情况下diff算法会判断是平移，更高效的渲染 举例：复选框+ 值，在前面加一条数据的时候复选框状态不变值改变 强调：使用v-for就必须加Key ，key 不能使用index 也不能使用随机数，因为当数组修改的时候index是改变的，没有意义。 小技巧：可以通过修改key值来进行组件内强制重写渲染。比如在表单上加一个key ，当提交或者取消的时候修改key值就会重写渲染整个表单实现数据重制。',2,NULL),(8,'2025-09-16 09:00:42.000','Router和route的区别','Route 是单条路由规则，Router 是管理和调度所有路由规则的路由器。',2,NULL),(9,'2025-09-16 09:00:42.000','Viet和Webpack的区别，如何优化Viet','他们的核心区别在于开发环境的理念不同，Webpack 是整体打包，所以构建速度慢，热更新慢，Vite 是使用ES Build 基于浏览器的ESM支持进行按需编译，热更新效率快，在生产环境上Vite使用的是RollUP但是也可以配置成WebPack  所以他们最终达到的效果都是为了打包前端项目，所以大体上差别不是很大 Vite 本身已经足够快了，但是对于大型项目仍可以对依赖预构建和构建产出进行优化 可以手动设置优化依赖，include 强制预构建依赖，exclude 排除不需要构建的依赖 构建产出优化可以进行：代码分割，减少包体积（tree-sheking） 也可以调整预构建缓存策略',2,NULL),(10,'2025-09-16 09:00:42.000','Npm,yarn ,pnpm 的区别是什么','它们都是 JavaScript 包管理器，但设计和性能上有很大差异。npm 是官方标准，Yarn 最初是为了解决 npm 早期的速度和一致性问题，而 pnpm 则是为了解决依赖磁盘空间和 phantom dependencies（幻影依赖）的根本问题。',2,NULL),(11,'2025-09-16 09:00:42.000','nuxt 和普通的vue编写起来有什么区别','和vue相比，nuxt是一个基于约定和规范的全栈框架，而vue本身是一个渐进式的前端试图库。 1.vue默认CSR,nuxt 默认SSR，提供SSG，CSR 支持混合模式 2.nuxt提供固定的目录结构，实现开箱即用的自动化功能，例如：文件的路由系统，组件的自动导入 3.可以在项目创建server 目录来编写API路由和服务器逻辑，无需单独配置node.js服务器 4.在工程化方面它已经内置最适合项目的方案，提供代码分割，打包优化，SEO处理 在开发过程中我觉得比较认可的一点是：自动组件导入，不需要手动import;还有一个userStatr 可以支持客户端和服务端状态存储；为SSR提供了特地的钩子函数：useAsyncData 简化异步处理',2,NULL),(12,'2025-09-16 09:04:53.000','事件循环机制是什么','因为javascript是单线程的，需要通过事件循环机制来出来同步任务和异步任务之间的关系，避免阻塞。机制是：先调用栈中的同步任务，然后处理微任务队列，在处理宏任务队列，处理完以后再清空一次微任务队列，处理完以后在进行循环处理',1,NULL),(13,'2025-09-16 09:04:53.000','如何实现权限管理','包含三重权限：路由权限，页面组件和按钮权限，接口数据权限 路由权限使用的是路由守卫，在进入路由前校验token和route 页面组件和按钮权限使用v-if+权限判断或者自定义组件  接口数据权限就在接口调用前把Token传递给后端',1,NULL),(14,'2025-09-16 09:04:53.000','在组件开发中回存在哪些问题?','组件边界划分：粒度过大复用性差，过小维护复杂。解决方法是根据业务复用度和职责单一原则进行拆分。  组件通信和状态管理混乱：简单场景用 props/emit，跨层级用 provide/inject，大规模状态共享引入 Pinia。  样式隔离：避免样式污染，可以使用 Vue 的 scoped、CSS Modules，Tailwind 的原子化类名也能减少冲突。  性能优化：父组件重绘导致子组件重新渲染，可用 v-memo、shallowRef，或拆分组件、动态 import。  团队协作：通过 Prettier + ESLint + commitlint 保证代码风格一致，Storybook 提升组件文档化和复用。 在之前的项目中，我遇到过父组件数据更新导致子组件频繁重渲染的性能问题，通过 v-memo 和动态 import 成功优化，渲染性能提升了约 30%。',1,NULL),(15,'2025-09-16 09:04:53.000','你做过大屏展示是通过什么实现的,会出现什么问题?','使用ECharts 做图表展示，tailwindCss做页面布局，大屏自适应布局使用rem 遇到的问题，最开始我们做实时数据获取的时候使用的是前端轮询调用接口获取数据，但是后面数据量上来以后页面卡顿异常 然后就引入了WebSockt 来进行后端推送数据，然后使用动态import按需加载页面和组件，减少不必要的页面闪烁，加载前对比数据只对修改数据进行加载，然后首次加载的时候引入了tree-shaking 避免打包整个库',1,NULL),(16,'2025-09-16 09:04:53.000','如何解决浏览器兼容问题/你遇到过哪些浏览器的兼容问题?','浏览器兼容问题主要分为 HTML 标签特性、CSS 渲染差异、JS 新语法 & API 支持、内核差异、移动端兼容 等几个方面。 我的解决思路一般是：  预防：开发前查询 caniuse，选用合适技术； 编译层：Babel 转译，Autoprefixer 加前缀，Polyfill 补齐 API； 运行时：功能检测（Modernizr）、优雅降级或渐进增强； 适配层：CSS Reset、Normalize.css，必要时针对不同浏览器写 Hack。 例如，遇到过 flex 在 IE11 下不兼容 的情况，我通过 -ms- 前缀和 fallback 布局解决；Safari 下 input 自动缩放问题，通过 meta viewport 和 font-size 调整解决。',1,NULL),(17,'2025-09-16 09:04:53.000','vite和webpack的区别是什么?','vite利用的是ESbuld进行依赖预构建，开发时不需要整体打包，能大幅提升启动速度和热更新性能；webpack生态更成熟，功能更全面，但是在性能和开发体验上相对较弱，大型项目启动较慢',1,NULL),(18,'2025-09-16 09:06:33.000','组件间通信的方法有哪些','父子组件间通信通常使用：props和emit 或者使用v-modol 进行双向绑定 兄弟组件通信通常使用父组件做中间或者使用事件总线mitt 跨层级通信使用：provide和inject 一些状态和全局变量就放到pinia存储',1,NULL),(19,'2025-09-16 09:06:33.000','如何优化Vite?','依赖优化：较大的依赖手动配置 按需加载：路由、组件、第三方库使用动态 import，减小首屏体积。 CDN 加速 资源优化：压缩图片、小图转 base64、SVG 替代大图。 缓存与分包：手动配置 manualChunks，提高缓存利用率。 生产优化：gzip 压缩、Tree Shaking、esbuild.minify。 开发优化：proxy 解决跨域、分析依赖、减少不必要的构建。',1,NULL),(20,'2025-09-16 09:07:17.000','请简单的做个自我介绍','面试官你好，我叫陈湘森,24岁，来自湖南邵阳，毕业于湖南工程职业技术学校，曾在学校担任社团联合会网络宣传部部长一职， 之后在深圳巨鼎医疗公司担任的前端开发工程师；  个人技术栈是： JavaScript、TypeScript、Vue3、Nuxt、Pinia、TailwindCSS 等， 也具备一定的 Node.js、PostgreSQL、Redis、BullMQ 的后端开发经验。  最近，我主导开发了一个 AI Galgame 素材生成平台，主要负责前端页面交互设计与代码实现， 之前在公司参与全院管理系统、终端支付管理系统 等医疗项目，主要是前端数据可视化，报表打印相关的工作，  未来我会持续深入前端生态，学习前沿技术，同时拓展全栈能力，提升工程化与系统设计水平。 希望能有机会在贵公司展现我的个人价值，谢谢。 ',0,NULL),(22,'2025-09-16 14:11:53.000','解释 JavaScript 中变量提升（hoisting）的概念','这是JavaScript中的一种行为，指的是在代码执行前所有的变量声明和函数声明都会被提升到其所在作用域的顶部。也就是说无论你的变量声明在那个位置，都会先声明变量，然后在做其他操作。但是赋值是不会提前的。 所有类型都会提升，但是提升以后能正常访问的只有var 和函数 /已经var 修饰的函数表达式。Let 和 const 修饰的无法访问 示例：console.log(a); var a =5;  会打印出来undefind 而不是报错',4,NULL),(23,'2025-09-16 14:13:37.000','let、var 和 const 创建的变量有什么区别？','let 和 const 都是块级作用域，var 是函数作用域。块级作用域只能在{}中使用 都可以提升变量，但是let 和const 提升以后会出现暂时性死区 var 可以重复声明，其它的不行 const 在声明的时候必须赋值，赋值以后就不能在进行修改；其他可以不赋值，可改',4,NULL),(24,'2025-09-16 14:15:54.000','JavaScript 中 == 和 === 有什么区别？','== 是宽松对比，它会把等号两边的值尝试修改一下类型，最后值相等=true === 是严格对比，必须类型，值都相等。注意引用类型对比都是false 对比的是内存',4,NULL),(25,'2025-09-16 14:20:38.000','JavaScript 运行时的事件循环（event loop）是什么？','事件循环是JavaScript运行时用来处理异步操作和协调任务执行顺序的机制 事件循环：调用栈—>执行微任务队列—>执行宏任务队列—>调用栈  面试回答： javaScript 是一个单线程语言，事件循环是用来处理异步任务的机制，确保异步代码在合适的时候执行，不回阻塞主线程。整个运行是否分为三步：调用栈-任务队列-事件循环机制。任务队列：宏任务队列+微任务队列。先微在宏',4,NULL),(26,'2025-09-16 14:22:30.000','解释什么是 JavaScript 的事件委托（event delegation）','事件委托是JavaScript中常见的事件处理模式。核心思想：不在每个子元素上添加事件监听器，而是在父元素上添加事件监听器，然后通过事件冒泡来捕捉事件触发 原理：事件默认是冒泡的，也就是说子元素的事件会一直向上传递到document  通过给父级元素添加事件监听器，可以通过event.target 获取触发事件的子元素 总结：事件委托就是利用事件冒泡，在父元素上统一处理子元素，让代码更高效灵活',4,NULL),(27,'2025-09-16 14:23:37.000','解释 JavaScript 中 this 的工作原理','This是指的函数执行时的上下文对象，它的值不是在定义的时候决定的，而是在函数被调用时动态绑定的。 this 的绑定方式：默认绑定，隐式绑定，显示绑定，构造函数绑定，箭头函数绑定 注意：回调函数中的this默认不是你期望的对象，容易丢失，可以使用bind() 或者箭头函数来解决',4,NULL),(28,'2025-09-16 14:26:48.000','浏览器中 cookie、sessionStorage 和 localStorage 有什么区别？','Cookie:由服务端/客户端创建，每次调用都会带上，可以通过设置HttpOnly 禁止js 访问，可以设置过期事件销毁，但是容量小4kb ,在同源时可以跨窗口/标签使用 seccionStorage:由客户端创建，只能在单标签页里面被访问（同源），页面销毁seccion也就销毁。 localStorage:由客户端创建，只要不手动回收就会一直存在，可以根据时间戳来定义过期逻辑，同源下所有页面共享。 Cookie 和 Seccion 的区别：seccion 只能由服务端创建，然后存储在服务端，相对安全，cookie 存储token 或者用户偏好等等，请求的时候携带cookie 里面可以存在一个seccion id 与后端进行对比。但是也容易劫持',4,NULL),(29,'2025-09-16 14:29:11.000','解释 <script>、<script async> 和 <script defer> 的区别','<script>：与HTML解析同步，在下载或者执行js 期间会阻塞HTML的解析 <script async>：与HTML解析并行，脚本可用时立即执行，会阻塞HTML解析，并且JS执行顺序不确定，然后脚本之间互不干涉 <script defer>: 与HTML解析并行，它会等HTML解析完成以后按照在HTML中出现的顺序进行',4,NULL),(30,'2025-09-16 14:31:12.000','JavaScript 变量 null、undefined 和 undeclared 有何不同？','Null:由开发人员定义并且明确赋值null   typeof 运算符返回 object UndefineD:由开发人员定义，但是并没有赋值  typeof 运算符返回 undefined  Underclared：未定义的为声明的变量，在做对比时会返回异常ReferenceError',4,NULL),(31,'2025-09-16 14:31:25.000','JavaScript 中 .call 和 .apply 的区别是什么？','共同点：都可以改变函数内this 的指向，不同点接收的参数类型不同 .call(函数，值1，值2)  接收单个值，用逗号隔开 .apply(函数，[值1，值2]) 接收一个数组，适用于位置参数 现代开发中通常使用 .call(函数, …[值1，值2]) 相当于 apply()。同时ES6中还提供了.bind（） 方法来修改this 的值 .bind(方法，预参数)：会返回一个方法，方法执行可以不立即执行。其他两个立即执行',4,NULL),(32,'2025-09-16 14:38:40.000','在构造函数的方法中使用箭头函数有什么优势？','箭头函数不指定自己的this ，它会捕获定义时的上下文（即构造函数里面的this）,这个时候的this其实就是固定不会改变',4,NULL),(33,'2025-09-16 14:49:12.000','解释 JavaScript 中的原型继承的工作原理。','原型继承是指对象从其他对象中继承属性和方法的一种方式。每个对象都有一个默认属性：ProtoType    使用：  对象.protoType.属性= function (){}  这个可以添加一个对象 Object.setPrototypeof(目标对象.prototype,继承对象.prototype) 原型链：一个对象/构造函数 选择方法，可能自身或者方法里面都没有，可以往上找继承的对象里面有没有方法，有就调用，没有的话继续找，直到上面一直没有方法返回null',4,NULL),(34,'2025-09-16 15:03:43.000','JavaScript 中 function Person(){}、const person = Person() 和 const person = new Person() 有何区别？','第一个是创建一个函数，第二个是对函数的调用把函数返回的值赋值给，第三个是对构造函数的调用，返回一个新对象，并且this 指向新对象',4,NULL),(35,'2025-09-16 15:05:00.000','解释 function foo(){} 和 var foo = function(){} 中 foo 的使用差异','Function foo() : 函数的声明，可以在函数声明前调用函数 foo()  ，这是因为在变量提示的角度来看函数以及提升到最前面，可以调用，foo在全局/封闭作用域，定义通用函数 Var foo = function() {}：匿名函数表达式，只提升了变量，但是函数没有提示，可以访问到undefind 但是不能执行 foo()，并且变量可以重复赋值，可以作为匿名函数或者函数为值的情况 主要往变量提示的方向讲',4,NULL),(36,'2025-09-16 15:05:00.000','JavaScript 中匿名函数的典型使用场景有哪些？','匿名函数是没有名字的函数表达式；优点是简洁，不污染作用域；缺点是无法复用和调试不便。 回调函数 事件处理函数 立即执行函数表达式 高阶函数里面的内联函数 Promise 和异步处理 构造闭包',4,NULL);
/*!40000 ALTER TABLE `Question` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-12 10:24:57
