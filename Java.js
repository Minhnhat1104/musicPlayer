const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const PLAYER_STORAGE_KEY = "F8_PLAYER";

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
const playlist = $('.playlist')
const dashBoard = $('.dashboard')
const musicVolumeIcon = $('.volume')
const volume = $('.volume-magnitude')

const app = {
    currentIndex: 5,

    isRandom: false,

    isRepeated: false,

    isPlaying: false,

    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeated = this.config.isRepeated
    },

    songs: [
    {
      name: "How you like that - BLACKPINK",
      singer: "Raftaar x Fortnite",
      path: "./assests/audio/blackpink_how_you_like_that_m_v_-6884133955864984281.mp3",
      image: "./assests/img/howYouLikeThat.jpg"
    },
    {
      name: "Em thich - Thinh Suy",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "./assests/audio/em_thich_sean_x_lua_official_official_mv_lyric_-8215201216439477563.mp3",
      image: "./assests/img/emThich.jpg"
    },
    {
      name: "wishes - jamie miller",
      singer: "Raftaar x Brobha V",
      path: "./assests/audio/jamie_miller_wishes_ost_music_video_3543177370419650960.mp3",
      image: "./assests/img/wishes-jamieMiller.jpg"
    },
    {
      name: "money - LISA",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "./assests/audio/lisa_money_exclusive_performance_video_-1082727760893603124.mp3",
      image:
      "./assests/img/Money.jpeg"
    },
    {
      name: "happiness - olivia rodrigo",
      singer: "Raftaar",
      path: "./assests/audio/olivia_rodrigo_happier_lyric_video_7694895301496382311.mp3",
      image:
      "./assests/img/happiness.jpg"
    },
    {
      name: "Gone - Rosé",
      singer: "Raftaar x kr$na",
      path: "./assests/audio/rose_gone_m_v_7283681006405481751.mp3",
      image:
      "./assests/img/Gone-Rose.jpg"
    },
    {
      name: "all too well 10 minute version (taylor’s version)",
      singer: "Raftaar x Harjas",
      path: "./assests/audio/taylor_swift_all_too_well_10_minute_version_lyric_video_-935950175237079102.mp3",
      image:
      "./assests/img/allToWell - Taylor.png"
    },
    {
        name: "tiny love - thịnh suy",
        singer: "Raftaar x Harjas",
        path: "./assests/audio/tiny_love_music_video_-4928404490503216136.mp3",
        image:
        "./assests/img/tinyLove.jpg"
    },
    {
      name: "to the moon - hooliga",
      singer: "Raftaar x Harjas",
      path: "./assests/audio/to_the_moon_hooligan_official_lyric_video_7024310841466325340.mp3",
      image:
      "./assests/img/toTheMoon.jpg"
    }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
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
        playlist.innerHTML = htmls.join('')
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
        const iconVolumeUp = $('.icon-volume-up')
        const iconVolumeDown = $('.icon-volume-down')
        const iconVolumeOff = $('.icon-volume-off')

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
            // const scrollTop = window.scrollY || document.documentElement.scrollTop;
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
            _this.setConfig('isRandom', _this.isRandom)
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
            _this.setConfig('isRepeated', _this.isRepeated)
            repeatBtn.classList.toggle('active')
        }

        // xu li khi click vao song
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) 
            {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                




            }
        }

        // xu li khi click volume
        musicVolumeIcon.onclick = function(e) {
            musicVolumeIcon.classList.toggle('active')
        }
        
        // xu li khi thay doi volume
        volume.onchange = function(e) {
            audio.volume = Number(volume.value) / 100
            if (audio.volume === 0) {
                $('.volume .active').classList.remove('active')
                iconVolumeOff.classList.add('active')
            }
            else if (audio.volume < 0.5) {
                $('.volume .active').classList.remove('active')
                iconVolumeDown.classList.add('active')
            }
            else {
                $('.volume .active').classList.remove('active')
                iconVolumeUp.classList.add('active')
            }
        }

        volume.onclick = function(e) {
            e.stopPropagation()
        }
    },
    
    getCurrentSong: function() {
        return this.songs(this.currentIndex)
    },
    
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 300)
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
        this.scrollToActiveSong()
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
        this.scrollToActiveSong()

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
        //gán cấu hình từ cònig vào ứng dụng
        this.loadConfig()

        //định nghĩa các thuộc tính cho object
        this.defineProperties()

        // lắng nghe/ xử lí các sự kiện (DOM event)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        this.render()

        // Hien thi trang thai ban dau cua button repeat va random
        randomBtn.classList.toggle("active", this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeated)
    }

}

app.start()