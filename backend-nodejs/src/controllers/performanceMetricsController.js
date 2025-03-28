import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addPerformanceMetrics = async (req, res) => {
  try {
    const { 
      speed, 
      dribbling, 
      passing, 
      shooting, 
      defending, 
      agility, 
      stamina, 
      intelligence 
    } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid },
      include: { playerProfile: true }
    });

    if (!user || !user.playerProfile) {
      return res.status(404).json({ error: 'Player profile not found' });
    }

    const performanceMetrics = await prisma.performanceMetrics.create({
      data: {
        playerProfileId: user.playerProfile.id,
        speed,
        dribbling,
        passing,
        shooting,
        defending,
        agility,
        stamina,
        intelligence
      }
    });

    res.status(201).json(performanceMetrics);
  } catch (error) {
    console.error('Add performance metrics error:', error);
    res.status(500).json({ error: 'Failed to add performance metrics', details: error.message });
  }
};

export const getPerformanceMetrics = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid },
      include: { 
        playerProfile: { 
          include: { performanceMetrics: true } 
        } 
      }
    });

    if (!user || !user.playerProfile) {
      return res.status(404).json({ error: 'Player profile not found' });
    }

    res.status(200).json(user.playerProfile.performanceMetrics);
  } catch (error) {
    console.error('Get performance metrics error:', error);
    res.status(500).json({ error: 'Failed to retrieve performance metrics', details: error.message });
  }
};

export const updatePerformanceMetrics = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      speed, 
      dribbling, 
      passing, 
      shooting, 
      defending, 
      agility, 
      stamina, 
      intelligence 
    } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid },
      include: { playerProfile: true }
    });

    if (!user || !user.playerProfile) {
      return res.status(404).json({ error: 'Player profile not found' });
    }

    // Verify metrics belongs to user's profile
    const metric = await prisma.performanceMetrics.findUnique({
      where: { id }
    });

    if (!metric || metric.playerProfileId !== user.playerProfile.id) {
      return res.status(403).json({ error: 'Unauthorized access to performance metrics' });
    }

    const updatedMetrics = await prisma.performanceMetrics.update({
      where: { id },
      data: {
        speed,
        dribbling,
        passing,
        shooting,
        defending,
        agility,
        stamina,
        intelligence
      }
    });

    res.status(200).json(updatedMetrics);
  } catch (error) {
    console.error('Update performance metrics error:', error);
    res.status(500).json({ error: 'Failed to update performance metrics', details: error.message });
  }
};

export const deletePerformanceMetrics = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid },
      include: { playerProfile: true }
    });

    if (!user || !user.playerProfile) {
      return res.status(404).json({ error: 'Player profile not found' });
    }

    // Verify metrics belongs to user's profile
    const metric = await prisma.performanceMetrics.findUnique({
      where: { id }
    });

    if (!metric || metric.playerProfileId !== user.playerProfile.id) {
      return res.status(403).json({ error: 'Unauthorized access to performance metrics' });
    }

    await prisma.performanceMetrics.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Performance metrics deleted successfully' });
  } catch (error) {
    console.error('Delete performance metrics error:', error);
    res.status(500).json({ error: 'Failed to delete performance metrics', details: error.message });
  }
};