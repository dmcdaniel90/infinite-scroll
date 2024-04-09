'use strict'
import 'dotenv/config'
interface Photo {
  urls: {
    regular: string
  }
  alt_description: string
  links: {
    html: string
  }
}

interface HTMLAttributes {
  [key: string]: string
}

// Select the Image Container and Loading Container by ID
const imageContainer = document.getElementById('image-container')
const loadingContainer = document.getElementById('loading-container')

let ready = false
let isInitialLoad = true
let requestCount: number = isInitialLoad ? 8 : 30
let imagesLoaded: number = 0
let totalImages: number = 0
let photosArray: Array<Photo> = []

// Unsplash API
const ACCESS_KEY = process.env.UNSPLASH_API_KEY
const apiURL: string = `https://api.unsplash.com/photos/random/?client_id=${ACCESS_KEY}&count=${requestCount}`

// On load
getPhotos()

// Get photos
async function getPhotos(): Promise<void> {
  try {
    const request: Response = await fetch(apiURL)
    const response: any = await request.json()

    // Error handling
    if (response.errors) {
      throw new Error(response.errors.message)
    } else {
      // Add photos to photosArray if no errors
      photosArray = response

      // Ensures that each request after initial sets the requestCount to 30
      isInitialLoad = false

      // Load Images
      displayPhotos()
    }
  } catch (error) {
    setError(error)
    console.error(error)
  }
}

// Create elements and add to the DOM
function displayPhotos(): void {
  // Used to keep track of total # of loaded images, see imageLoaded()
  imagesLoaded = 0
  totalImages = photosArray.length

  photosArray.map((photo) => {
    // Create <a> to link to Unsplash
    const item: HTMLAnchorElement = document.createElement('a')
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
      class: 'img-link',
    })

    // Create image element
    const img: HTMLImageElement = document.createElement('img')
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    })

    // Event listener, check when each is finished loading
    img.addEventListener('load', (): void => {
      // Runs on each image's 'load' event
      imageLoaded()
    })

    // Put <img> inside <a>, then put both inside imageContainer
    item.appendChild(img)
    imageContainer?.appendChild(item)
  })
}

// Check if all images were loaded
function imageLoaded(): void {
  //Increment images loaded
  imagesLoaded++

  // All images in the array should have fired the 'load' event
  if (imagesLoaded === totalImages) {
    ready = true
    // Hide loader
    loadingContainer?.classList.add('hidden')
  }
}

// Sets an error page with a Lottie Animation
function setError(error: any): void {
  // Create elements for error page
  const errorMessage: HTMLHeadingElement = document.createElement('h2')
  const errorImage: HTMLIFrameElement = document.createElement('iframe')
  const retryButton: HTMLButtonElement = document.createElement('button')

  // Set error message to user
  errorMessage.textContent = `${error.message}! Please try again later.`
  setAttributes(errorMessage, {
    class: 'error',
  })

  // Lottie Animation
  setAttributes(errorImage, {
    src: 'https://lottie.host/embed/df3eb377-7228-421e-a5b8-6a68da51dabd/uqPXNHpPbo.json',
    frameBorder: '0',
    class: 'error-image',
  })

  // Retry button
  retryButton.textContent = 'Retry'
  setAttributes(retryButton, {
    class: 'retry-button',
  })

  // Reload window when retry button is clicked
  retryButton.addEventListener('click', (): void => {
    window.location.reload()
  })

  // Put error elements in the DOM
  imageContainer?.appendChild(errorMessage)
  imageContainer?.appendChild(errorImage)
  imageContainer?.appendChild(retryButton)

  // Remove image container and show error container
  imageContainer?.classList.replace('image-container', 'error-container')

  // Hide loader
  loadingContainer?.classList.add('hidden')
}

// Load more photos if scroll is near bottom
/**=======================
 * *       Infinite Scroll
 *  Viewport height + amount user has scrolled vertically >= height of body (box-sizing: padding) - 1000
 * Ex. const isScrolling = 1000px + 500px >= 1800 - 1000
 *
 *========================**/
window.addEventListener('scroll', (): void => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false
    getPhotos()
  }
})

// Helper function to set attributes

function setAttributes(element: HTMLElement, attributes: HTMLAttributes): void {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key])
  }
}
