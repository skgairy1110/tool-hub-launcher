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

    // Use yt-dlp alternative API to get video stream URLs
    const apiResponse = await fetch(`https://yt-dlp-api.herokuapp.com/api/info?url=https://www.youtube.com/watch?v=${videoId}`)
    
    if (!apiResponse.ok) {
      throw new Error('Failed to fetch video information')
    }

    const videoInfo = await apiResponse.json()
    
    if (!videoInfo.formats || videoInfo.formats.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No video formats found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Filter for video formats with audio
    const videoFormats = videoInfo.formats.filter((format: any) => 
      format.vcodec !== 'none' && format.acodec !== 'none' && format.url
    )

    // Get best quality format
    const bestFormat = videoFormats.reduce((best: any, current: any) => {
      const bestHeight = best?.height || 0
      const currentHeight = current?.height || 0
      return currentHeight > bestHeight ? current : best
    }, videoFormats[0])

    if (!bestFormat) {
      return new Response(
        JSON.stringify({ error: 'No suitable video format found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Download the video
    const videoResponse = await fetch(bestFormat.url)
    
    if (!videoResponse.ok) {
      throw new Error('Failed to download video')
    }

    const videoBlob = await videoResponse.arrayBuffer()
    
    return new Response(videoBlob, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${videoInfo.title || 'video'}.mp4"`,
        'Content-Length': videoBlob.byteLength.toString()
      }
    })

  } catch (error) {
    console.error('Error downloading video:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to download video: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})