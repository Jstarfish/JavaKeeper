import Vue from 'vue'
import Paginate from 'src/components/Paginate.vue'

describe('Paginate', () => {
  const Component = Vue.extend(Paginate)
  function initComponent() {
    return new Component({
      propsData: {
        pageCount: 10
      }
    }).$mount()
  }

  describe('Simple Cases', () => {
    it('success', () => {
      const vm = initComponent()
      expect(vm.$el.querySelector("li:first-child a").textContent).to.equal("Prev")
      expect(vm.$el.querySelector("li:last-child a").textContent).to.equal("Next")
      expect(vm.$el.querySelector(".active a").textContent).to.equal("1")
    })

    it('next and prev button event right', () => {
      const vm = initComponent()
      const nextButton = vm.$el.querySelector("li:last-child a")
      nextButton.click()

      Vue.nextTick(() => {
        expect(vm.$el.querySelector(".active a").textContent).to.equal("2")

        const prevButton = vm.$el.querySelector("li:first-child a")
        prevButton.click()

        Vue.nextTick(() => {
          expect(vm.$el.querySelector(".active a").textContent).to.equal("1")
        })
      })
    })

    it('prev button when first page', () => {
      const vm = initComponent()
      const prevButton = vm.$el.querySelector("li:first-child a")
      prevButton.click()

      Vue.nextTick(() => {
        expect(vm.$el.querySelector(".active a").textContent).to.equal("1")
      })
    })

    it('click page element', () => {
      const vm = initComponent()
      const pageItem = vm.$el.querySelector('li:nth-child(3) a')
      pageItem.click()
      Vue.nextTick(() => {
        expect(vm.$el.querySelector(".active a").textContent).to.equal("2")
      })
    })

    it('set initial page success', () => {
      const vm = new Component({
        propsData: {
          pageCount: 10,
          value: 2
        }
      }).$mount()
      expect(vm.$el.querySelector(".active a").textContent).to.equal("2")
    })

    it('set forcePage success', () => {
      const vm = new Component({
        propsData: {
          pageCount: 10,
          initialPage: 0,
          forcePage: 5
        }
      }).$mount()

      const nextButton = vm.$el.querySelector("li:last-child a")
      nextButton.click()
      Vue.nextTick(() => {
        expect(vm.$el.querySelector(".active a").textContent).to.equal("6")

        const prevButton = vm.$el.querySelector("li:first-child a")
        prevButton.click()

        Vue.nextTick(() => {
          expect(vm.$el.querySelector(".active a").textContent).to.equal("6")
        })
      })
    })

    it('set forcePage in initialPage', () => {
      const vm = new Component({
        propsData: {
          pageCount: 10,
          value: 6,
          forcePage: 6
        }
      }).$mount()

      expect(vm.$el.querySelector(".active a").textContent).to.equal("6")
      const nextButton = vm.$el.querySelector("li:last-child a")
      nextButton.click()
      Vue.nextTick(() => {
        expect(vm.$el.querySelector(".active a").textContent).to.equal("6")
      })
    })
  })

  describe('page range tests', () => {
    it('page count not more than range', () => {
      const vm = new Component({
        propsData: {
          pageCount: 5,
          pageRange: 5
        }
      }).$mount()
      expect(vm.$el.querySelectorAll("li a").length).to.equal(7)
    })

    it('only has breakView in left', () => {
      const vm = new Component({
        propsData: {
          pageCount: 10,
          value: 10,
          breakViewClass: 'break-view'
        }
      }).$mount()
      expect(vm.$el.querySelectorAll(`li:nth-child(3).break-view`).length).to.equal(1)
      expect(vm.$el.querySelector(`li:nth-child(3) a`).textContent).to.equal('…')
      expect(vm.$el.querySelector(`li:nth-child(4) a`).textContent).to.equal('8')
    })

    it('page range is correct when current page is 0', () => {
      const vm = new Component({
        propsData: {
          pageCount: 10,
          pageRange: 5,
          marginPages: 0,
          value: 1,
          prevClass: 'ignore',
          nextClass: 'ignore',
          disabledClass: 'ignore'
        }
      }).$mount()
      expect(vm.$el.querySelectorAll("li:not(.ignore) a").length).to.equal(5)
    })

    it('page range is correct when current page is middle page', () => {
      const vm = new Component({
        propsData: {
          pageCount: 10,
          pageRange: 5,
          marginPages: 0,
          value: 5,
          prevClass: 'ignore',
          nextClass: 'ignore',
          disabledClass: 'ignore'
        }
      }).$mount()
      expect(vm.$el.querySelectorAll("li:not(.ignore) a").length).to.equal(5)
    })

    it('page range is correct when current page is last page', () => {
      const vm = new Component({
        propsData: {
          pageCount: 10,
          pageRange: 5,
          marginPages: 0,
          value: 10,
          prevClass: 'ignore',
          nextClass: 'ignore',
          disabledClass: 'ignore'
        }
      }).$mount()
      expect(vm.$el.querySelectorAll("li:not(.ignore) a").length).to.equal(5)
    })
  })

  describe('enable first and last button', () => {
    it('Show fist and last button', () => {
      const vm = new Component({
        propsData: {
          value: 2,
          pageCount: 10,
          firstLastButton: true
        }
      }).$mount()
      const firstButton = vm.$el.querySelector("li:first-child a")
      const lastButton = vm.$el.querySelector("li:last-child a")
      const activeItem = vm.$el.querySelector(".active a")
      expect(firstButton.textContent).to.equal("First")
      expect(lastButton.textContent).to.equal("Last")
      expect(activeItem.textContent).to.equal("2")

      firstButton.click()
      Vue.nextTick(() => {
        expect(activeItem.textContent).to.equal("1")

        lastButton.click()
        Vue.nextTick(() => {
          expect(activeItem.textContent).to.equal("10")
        })
      })
    })

    it('Show fist and last button when no li surround', () => {
      const vm = new Component({
        propsData: {
          value: 2,
          pageCount: 10,
          noLiSurround: true,
          firstLastButton: true
        }
      }).$mount()
      const firstButton = vm.$el.querySelector("a:first-child")
      const lastButton = vm.$el.querySelector("a:last-child")
      const activeItem = vm.$el.querySelector("a.active")
      expect(firstButton.textContent).to.equal("First")
      expect(lastButton.textContent).to.equal("Last")
      expect(activeItem.textContent).to.equal("2")

      // firstButton.click()
      // Vue.nextTick(() => {
      //   expect(activeItem.textContent).to.equal("1")
      //
      //   lastButton.click()
      //   Vue.nextTick(() => {
      //     expect(activeItem.textContent).to.equal("10")
      //   })
      // })
    })
  })

  describe('prev and next button hide', () => {
    it('hide prev button when there is no previous page', () => {
      const vm = new Component({
        propsData: {
          pageCount: 10,
          value: 1,
          hidePrevNext: true
        }
      }).$mount()

      const firstButton = vm.$el.querySelector("li:first-child a")
      expect(firstButton.textContent).to.equal("1")
    })

    it('hide next button when there is no next page', () => {
      const vm = new Component({
        propsData: {
          pageCount: 10,
          value: 10,
          hidePrevNext: true
        }
      }).$mount()

      const lastButton = vm.$el.querySelector("li:last-child a")
      expect(lastButton.textContent).to.equal("10")
    })

    it('hide next and prev button when only one page', () => {
      const vm = new Component({
        propsData: {
          pageCount: 1,
          hidePrevNext: true
        }
      }).$mount()

      const firstButton = vm.$el.querySelector("li:first-child a")
      const lastButton = vm.$el.querySelector("li:last-child a")
      expect(firstButton.textContent).to.equal("1")
      expect(lastButton.textContent).to.equal("1")
    })
  })
  
  it('Use custom text', () => {
    const vm = new Component({
      propsData: {
        pageCount: 10,
        prevClass: 'prev-item',
        nextClass: 'next-item',
        breakViewClass: 'break-view',
        prevText: 'PREVIOUS TEXT',
        nextText: 'NEXT TEXT',
        breakViewText: 'BREAK VIEW TEXT'
      }
    }).$mount()
    const prevButton = vm.$el.querySelector('.prev-item')
    const nextButton = vm.$el.querySelector('.next-item')
    const breakView = vm.$el.querySelector('.break-view')
    expect(prevButton.textContent).to.equal('PREVIOUS TEXT')
    expect(nextButton.textContent).to.equal('NEXT TEXT')
    expect(breakView.textContent).to.equal('BREAK VIEW TEXT')
  })

})
