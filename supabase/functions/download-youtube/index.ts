import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { videoUrl } = await req.json()
    
    if (!videoUrl) {
      return new Response(
        JSON.stringify({ error: 'Video URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract video ID from YouTube URL
    const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (!videoIdMatch) {
      return new Response(
        JSON.stringify({ error: 'Invalid YouTube URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const videoId = videoIdMatch[1]

    // Try multiple APIs for better reliability
    const apis = [
      `https://api.cobalt.tools/api/json`,
      `https://api.downloadgram.com/api/video/info`,
      `https://youtube-dl-express.vercel.app/api/video?url=${encodeURIComponent(videoUrl)}`
    ]

    let videoInfo = null
    let downloadUrl = null

    // Try Cobalt Tools API first (most reliable)
    try {
      const cobaltResponse = await fetch('https://api.cobalt.tools/api/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          url: videoUrl,
          vQuality: '720',
          aFormat: 'mp3',
          filenamePattern: 'classic'
        })
      })

      if (cobaltResponse.ok) {
        const cobaltData = await cobaltResponse.json()
        if (cobaltData.status === 'success' && cobaltData.url) {
          downloadUrl = cobaltData.url
          videoInfo = { title: cobaltData.filename || 'video' }
        }
      }
    } catch (e) {
      console.log('Cobalt API failed:', e)
    }

    // Fallback to direct YouTube video extraction if Cobalt fails
    if (!downloadUrl) {
      try {
        // Use a more reliable method to get video streams
        const ytResponse = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`)
        if (ytResponse.ok) {
          const ytData = await ytResponse.json()
          videoInfo = { title: ytData.title || 'video' }
          
          // For now, return the video info and let the frontend handle the download
          // This is a safer approach than trying to proxy large video files
          return new Response(
            JSON.stringify({ 
              message: 'Video found but direct download not available. Please use the download links provided.',
              videoInfo: videoInfo,
              downloadUrls: [
                `https://y2mate.com/youtube/${videoId}`,
                `https://ssyoutube.com/watch?v=${videoId}`,
                `https://savefrom.net/#url=${encodeURIComponent(videoUrl)}`
              ]
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      } catch (e) {
        console.log('YouTube extraction failed:', e)
      }
    }

    if (downloadUrl) {
      // Download the video
      const videoResponse = await fetch(downloadUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      if (!videoResponse.ok) {
        throw new Error('Failed to download video from source')
      }

      const videoBlob = await videoResponse.arrayBuffer()
      
      return new Response(videoBlob, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'video/mp4',
          'Content-Disposition': `attachment; filename="${videoInfo?.title || 'video'}.mp4"`,
          'Content-Length': videoBlob.byteLength.toString()
        }
      })
    }

    // If all else fails, return error
    return new Response(
      JSON.stringify({ error: 'Unable to extract video download link. YouTube may have restrictions on this video.' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error downloading video:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to download video: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})