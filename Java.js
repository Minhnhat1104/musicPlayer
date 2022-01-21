const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 5,

    isRandom: false,

    isRepeated: false,

    isPlaying: false,
    
    songs: [
    {
      name: "Dio's Theme but it's EPIC VERSION",
      singer: "Raftaar x Fortnite",
      path: "./assests/audio/dio_s_theme_but_it_s_epic_version_feat_beast_titan_theme_jojo_x_aot_mashup_-938651083812224236.mp3",
      image: "./assests/img/Dio.png"
    },
    {
      name: "Giorno's Theme but it's EPIC VERSION",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "./assests/audio/giorno_s_theme_but_it_s_epic_version_-8419081268927556568.mp3",
      image: "./assests/img/Dio.png"
    },
    {
      name: "JJBA Stone Ocean: Jolyne Theme (Full Version) | EPIC HQ COVER",
      singer: "Raftaar x Brobha V",
      path:"./assests/audio/jjba_stone_ocean_jolyne_theme_full_version_epic_hq_cover_-3823576432034659423.mp3",
      image: "./assests/img/Dio.png"
    },
    {
      name: "Jonathan Joestar Theme but it's EPIC OVERDRIVE VERSION",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "./assests/audio/jonathan_joestar_theme_but_it_s_epic_overdrive_version_5695007905971304339.mp3",
      image:
        "./assests/img/Dio.png"
    },
    {
      name: "Josuke Theme but it's EPIC VERSION",
      singer: "Raftaar",
      path: "./assests/audio/josuke_theme_but_it_s_epic_version_feat_giorno_jotaro_theme_4894134593535635595.mp3",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
    },
    {
      name: "Jotaro Theme but it's EPIC VERSION (Star Platinum Over Heaven)",
      singer: "Raftaar x kr$na",
      path:
      "./assests/audio/jotaro_theme_but_it_s_epic_version_yare_yare_daze_-2824756580420447017.mp3",
      image:
      "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
    },
    {
      name: "Pillar's theme",
      singer: "Raftaar x Harjas",
      path: "./assests/audio/pillar_men_theme_but_it_s_epic_version_awaken_-9092928326350760432.mp3",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
    }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    
    handleEvents: function() {
        const _this = this
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth

        // xử lí cd quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()


        // xử lí phóng to, thu nhỏ
        document.onscroll = function() {
            const newCdWidth = cdWidth - window.scrollY
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth+'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xử lí khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }

        // khi song dc play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // khi song bi pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        },

        // khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime/audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //xử lí khi tua song
        progress.onchange = function(e) {
            const seekTime = e.target.value / 100 * audio.duration
            audio.currentTime = seekTime
        }

        //khi next song
        nextBtn.onclick = function() {
            _this.nextSong()
            audio.play()
        }
        //khi prev song
        prevBtn.onclick = function() {
            _this.prevSong()
            audio.play()
        }

        //xu li random bat tat
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle("active")
        }

        // xu li next song khi audio ended 
        audio.onended = function() {
            if (_this.isRepeated) {
                audio.play()
            }
            else {
                _this.nextSong()
            }
            audio.play()
        }

        //
        repeatBtn.onclick = function(e) {
            _this.isRepeated = !_this.isRepeated
            repeatBtn.classList.toggle('active')
        }
    },
    
    getCurrentSong: function() {
        return this.songs(this.currentIndex)
    },
    
    loadCurrentSong: function() {
        const heading = $('header h2')
        const cdThumb = $('.cd-thumb')
        const audio = $('#audio')

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = `${this.currentSong.path}`
    },

    nextSong: function() {
        if (this.isRandom) {
            this.playRandomSong()
        }
        else {
            this.currentIndex++
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
        }
        this.loadCurrentSong()
        this.render()
    },

    prevSong: function() {
        if (this.isRandom) {
            this.playRandomSong()
        }
        else {
            this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length -1
            }
        }
        this.loadCurrentSong()
        this.render()

    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } 
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.render()
    },

    start: function() {
        //định nghĩa các thuộc tính cho object
        this.defineProperties()

        // lắng nghe/ xử lí các sự kiện (DOM event)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        this.render()
    }

}

app.start()