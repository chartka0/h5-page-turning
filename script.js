// 在DOM完全加载后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化 Swiper
    const swiper = new Swiper('.swiper-container', {
        direction: 'vertical',           // 垂直方向滑动
        slidesPerView: 1,                // 一次只显示一张幻灯片
        spaceBetween: 0,                 // 幻灯片之间的距离
        mousewheel: true,                // 支持鼠标滚轮
        simulateTouch: true,             // 支持触摸滑动
        grabCursor: true,                // 显示抓取光标
        speed: 500,                      // 过渡速度
        longSwipesRatio: 0.1,            // 长滑动的阈值比例
        followFinger: true,              // 滑动时跟随手指移动
        touchRatio: 1,                   // 触摸灵敏度
        touchAngle: 45,                  // 允许的触摸角度
        resistance: true,                // 边缘抵抗
        resistanceRatio: 0,              // 设置边缘抵抗比例为0，完全禁止超出边缘的拖动
        threshold: 10,                   // 触发滑动的阈值
        
        // 无法通过快速滑动切换多页
        shortSwipes: true,
        longSwipes: true,
        longSwipesMs: 100,
        
        // 确保每次滑动只能滑动一页
        preventInteractionOnTransition: true,
        allowTouchMove: true,
        touchMoveStopPropagation: true,
        
        // 启用键盘控制
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        
        // 启用触摸边缘时强制翻页
        edgeSwipeDetection: true,
        edgeSwipeThreshold: 20,
        
        // 预加载所有幻灯片，避免出现闪烁
        preloadImages: true,
        updateOnImagesReady: true,
    });

    // 限制第一页和最后一页的拖动方向
    let startTouchY = 0;

    // 添加触摸开始事件监听
    swiper.el.addEventListener('touchstart', function(e) {
        startTouchY = e.touches[0].clientY;
    });

    // 添加触摸移动事件监听
    swiper.el.addEventListener('touchmove', function(e) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startTouchY;
        
        // 如果是第一页且想向下拖动（下滑）
        if (swiper.isBeginning && diff > 0) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        // 如果是最后一页且想向上拖动（上滑）
        if (swiper.isEnd && diff < 0) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, { passive: false });

    // 添加鼠标事件监听
    let isMouseDown = false;
    let startMouseY = 0;

    swiper.el.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        startMouseY = e.clientY;
    });

    swiper.el.addEventListener('mousemove', function(e) {
        if (!isMouseDown) return;
        
        const diff = e.clientY - startMouseY;
        
        // 如果是第一页且想向下拖动
        if (swiper.isBeginning && diff > 0) {
            e.preventDefault();
            return false;
        }
        
        // 如果是最后一页且想向上拖动
        if (swiper.isEnd && diff < 0) {
            e.preventDefault();
            return false;
        }
    });

    swiper.el.addEventListener('mouseup', function() {
        isMouseDown = false;
    });

    swiper.el.addEventListener('mouseleave', function() {
        isMouseDown = false;
    });

    // 修改鼠标滚轮事件处理
    swiper.el.addEventListener('wheel', function(e) {
        // 如果是第一页且向下滚动
        if (swiper.isBeginning && e.deltaY < 0) {
            e.preventDefault();
            return false;
        }
        
        // 如果是最后一页且向上滚动
        if (swiper.isEnd && e.deltaY > 0) {
            e.preventDefault();
            return false;
        }
    }, { passive: false });

    // 固定下一页按钮点击事件
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.addEventListener('click', () => {
        swiper.slideNext();
    });

    // 检查当前页面是否是最后一页，如果是则隐藏下一页按钮
    function updateNextButtonVisibility() {
        if (swiper.isEnd) {
            nextBtn.classList.add('hidden');
        } else {
            nextBtn.classList.remove('hidden');
        }
    }

    // 初始检查按钮可见性
    updateNextButtonVisibility();

    // 监听滑动事件，更新按钮可见性
    swiper.on('slideChange', () => {
        updateNextButtonVisibility();
    });

    // 确保在窗口大小变化时重新计算
    window.addEventListener('resize', () => {
        swiper.update();
        updateNextButtonVisibility();
        setViewportHeight();
    });

    // 为视口高度设置CSS变量，解决移动端的100vh问题
    function setViewportHeight() {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }

    // 初始设置
    setViewportHeight();

    // 音乐播放功能
    const musicControl = document.getElementById('musicControl');
    const musicOpenIcon = document.getElementById('musicOpenIcon');
    const musicCloseIcon = document.getElementById('musicCloseIcon');
    const audio = new Audio('https://a.u.h5mc.com/c/kufl/mpye/audios/674f3a747fb2d90a500017f4.mp3');

    // 音乐控制点击事件
    musicControl.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(e => {
                console.log('音频播放失败:', e);
                alert('音频播放失败，请尝试点击屏幕后再播放');
            });
            // 显示关闭图标，隐藏打开图标
            musicOpenIcon.classList.add('hidden');
            musicCloseIcon.classList.remove('hidden');
        } else {
            audio.pause();
            // 显示打开图标，隐藏关闭图标
            musicOpenIcon.classList.remove('hidden');
            musicCloseIcon.classList.add('hidden');
        }
    });

    // 音乐播放结束时重置图标状态
    audio.addEventListener('ended', () => {
        musicOpenIcon.classList.remove('hidden');
        musicCloseIcon.classList.add('hidden');
    });
}); 