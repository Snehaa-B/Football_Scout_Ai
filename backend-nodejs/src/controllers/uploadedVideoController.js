import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const uploadVideo = async (req, res) => {
  try {
    const { videoUrl, playerProfileId } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid } 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const playerProfile = await prisma.playerProfile.findUnique({
      where: { id: playerProfileId }
    });

    if (!playerProfile) {
      return res.status(400).json({ error: "Player profile does not exist." });
    }

    const uploadedVideo = await prisma.uploadedVideo.create({
      data: {
        userId: user.id,
        videoUrl,
        playerProfileId: playerProfileId || null,
        status: 'PENDING'
      }
    });

    res.status(201).json(uploadedVideo);
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ error: 'Failed to upload video', details: error.message });
  }
};

export const getVideos = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid },
      include: { 
        uploadedVideos: {
          include: {
            processedData: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.uploadedVideos);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ error: 'Failed to retrieve videos', details: error.message });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await prisma.uploadedVideo.findUnique({
      where: { id },
      include: { processedData: true }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Optional: Add authorization check to ensure user owns the video
    if (video.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    res.status(200).json(video);
  } catch (error) {
    console.error('Get video by ID error:', error);
    res.status(500).json({ error: 'Failed to retrieve video', details: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await prisma.uploadedVideo.findUnique({
      where: { id }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Ensure user is authorized to delete
    if (video.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    await prisma.uploadedVideo.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ error: 'Failed to delete video', details: error.message });
  }
};