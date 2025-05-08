import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
// import Hotspot from 'src/webgl/hotspot/Hotspot'
import WuHouCiApp from '@/WuHouCiApp'
import FlowEnum from '../flow/FlowEnum'

export default class AudioManager {
  app: WuHouCiApp

  listener: THREE.AudioListener
  source: THREE.Audio
  bgSource: THREE.Audio
  loader: THREE.AudioLoader
  transition: TWEEN.Group
  transFadeIn: TWEEN.Tween<THREE.Audio['gain']['gain']>
  transFadeOut: TWEEN.Tween<THREE.Audio['gain']['gain']>
  bgAudio: HTMLAudioElement
  resources = new Map<FlowEnum, string>()
  index: number

  constructor(app: WuHouCiApp) {
    this.app = app

    this.listener = new THREE.AudioListener()
    this.source = new THREE.Audio(this.listener)
    this.bgSource = new THREE.Audio(this.listener)
    this.bgAudio = new Audio()
    this.loader = new THREE.AudioLoader()
    this.transition = this.app.tweens

    this.transFadeIn = new TWEEN.Tween(this.source.gain.gain).to({ value: 1 }, 1000).onStart(() => {
      this.source.play()
    })

    this.transFadeOut = new TWEEN.Tween(this.source.gain.gain)
      .to({ value: 0 }, 1000)
      .onComplete(() => {
        this.source.pause()
      })

    this.index = -1
  }

  init() {
    this.resources.set(FlowEnum.Intro, `audio/hotspot/Intro/${this.app.lang || 'zh'}.mp3`) //总览
    this.resources.set(FlowEnum.DaMen, `audio/hotspot/DaMen/${this.app.lang || 'zh'}.mp3`) //大门
    this.resources.set(FlowEnum.TangBei, `audio/hotspot/TangBei/${this.app.lang || 'zh'}.mp3`) //唐碑
    this.resources.set(FlowEnum.ChuShiBiao, `audio/hotspot/ChuShiBiao/${this.app.lang || 'zh'}.mp3`) //出师表
    this.resources.set(
      FlowEnum.WenChenLang,
      `audio/hotspot/WenChenLang/${this.app.lang || 'zh'}.mp3`,
    ) //文臣廊
    this.resources.set(
      FlowEnum.WuJiangLang,
      `audio/hotspot/WenChenLang/${this.app.lang || 'zh'}.mp3`,
    ) //武将廊
    this.resources.set(
      FlowEnum.HanZhaoLieMiao,
      `audio/hotspot/LiuBeiDian/${this.app.lang || 'zh'}.mp3`,
    ) //刘备殿
    this.resources.set(FlowEnum.WuHouCi, `audio/hotspot/WuHouCi/${this.app.lang || 'zh'}.mp3`) //孔明殿
    this.resources.set(FlowEnum.HuiLing, `audio/hotspot/HuiLing/${this.app.lang || 'zh'}.mp3`) //惠陵

    this.bgSource.loop = true
    this.bgSource.gain.gain.value = 0.12

    this.bgAudio.src = 'audio/background/background.mp3'
    this.bgAudio.crossOrigin = 'anonymous'
    this.bgAudio.autoplay = false
    this.bgAudio.loop = true
    this.bgAudio.muted = true
    this.bgAudio.id = 'a'
    document.body.appendChild(this.bgAudio)
    this.bgSource.setMediaElementSource(this.bgAudio)
  }

  reset() {
    this.bgAudio.pause()
    this.stopAudio()
  }

  start() {
    console.log('BgPlaying')

    this.listener.context.resume().then(() => {
      this.bgAudio.currentTime = 0
      this.bgAudio.play()
      this.bgAudio.muted = false
    })
  }

  playFlowAudio(flow: FlowEnum): Promise<any> {
    const resource = this.resources.get(flow)
    return this.playAudio(resource!)
  }

  playAudio(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject('未找到音频')
      } else {
        this.loader.load(
          url,
          (buffer) => {
            this.listener.context.resume().then(() => {
              this.source.setBuffer(buffer)
              this.source.offset = 0
              this.source.play()
              resolve('complete')
            })
          },
          undefined,
          undefined,
        )
      }
    })
  }

  stopAudio() {
    if (this.source.isPlaying) this.source.pause()
    this.source.buffer = null
  }

  trigger(trigger: boolean) {
    if (trigger) {
      this.transition.remove(this.transFadeOut)
      this.transition.add(this.transFadeIn.start())
    } else {
      this.transition.remove(this.transFadeIn)
      this.transition.add(this.transFadeOut.start())
    }
  }

  muted(muted: boolean) {
    if (muted) {
      this.transition.add(new TWEEN.Tween(this.listener.gain.gain).to({ value: 0 }, 500).start())
    } else {
      this.transition.add(new TWEEN.Tween(this.listener.gain.gain).to({ value: 1 }, 500).start())
    }
  }
}
