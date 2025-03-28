import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPlayerProfile = async (req, res) => {
  try {
    const { 
      age, 
      position, 
      club, 
      nationality, 
      speed, 
      dribbling, 
      passing, 
      shooting, 
      defending 
    } = req.body;

    // Find the user based on Firebase UID
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid } 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if profile already exists
    const existingProfile = await prisma.playerProfile.findUnique({
      where: { userId: user.id }
    });

    if (existingProfile) {
      return res.status(400).json({ error: 'Player profile already exists' });
    }

    const playerProfile = await prisma.playerProfile.create({
      data: {
        userId: user.id,
        age,
        position,
        club,
        nationality,
        speed,
        dribbling,
        passing,
        shooting,
        defending
      }
    });

    res.status(201).json(playerProfile);
  } catch (error) {
    console.error('Create player profile error:', error);
    res.status(500).json({ error: 'Failed to create player profile', details: error.message });
  }
};

export const getPlayerProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid },
      include: { 
        playerProfile: {
          include: {
            performanceMetrics: true,
            uploadedVideos: true,
            scoutReports: true
          }
        }
      }
    });

    if (!user || !user.playerProfile) {
      return res.status(404).json({ error: 'Player profile not found' });
    }

    res.status(200).json(user.playerProfile);
  } catch (error) {
    console.error('Get player profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve player profile', details: error.message });
  }
};

export const updatePlayerProfile = async (req, res) => {
  try {
    const { 
      age, 
      position, 
      club, 
      nationality, 
      speed, 
      dribbling, 
      passing, 
      shooting, 
      defending 
    } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid } 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedProfile = await prisma.playerProfile.update({
      where: { userId: user.id },
      data: {
        age,
        position,
        club,
        nationality,
        speed,
        dribbling,
        passing,
        shooting,
        defending
      }
    });

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Update player profile error:', error);
    res.status(500).json({ error: 'Failed to update player profile', details: error.message });
  }
};

export const deletePlayerProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid } 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.playerProfile.delete({
      where: { userId: user.id }
    });

    res.status(200).json({ message: 'Player profile deleted successfully' });
  } catch (error) {
    console.error('Delete player profile error:', error);
    res.status(500).json({ error: 'Failed to delete player profile', details: error.message });
  }
};
