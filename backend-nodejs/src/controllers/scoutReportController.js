import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createScoutReport = async (req, res) => {
  try {
    const { playerProfileId, rating, comments } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid } 
    });

    // Check if user is a scout
    if (user.role !== 'SCOUT') {
      return res.status(403).json({ error: 'Only scouts can create reports' });
    }

    const scoutReport = await prisma.scoutReport.create({
      data: {
        scoutId: user.id,
        playerProfileId,
        rating,
        comments
      }
    });

    res.status(201).json(scoutReport);
  } catch (error) {
    console.error('Create scout report error:', error);
    res.status(500).json({ error: 'Failed to create scout report', details: error.message });
  }
};

export const getScoutReports = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid } 
    });

    let scoutReports;
    if (user.role === 'SCOUT') {
      // Scouts can see their own reports
      scoutReports = await prisma.scoutReport.findMany({
        where: { scoutId: user.id },
        include: { 
          scout: true, 
          playerProfile: true 
        }
      });
    } else {
      // Players can see reports about their profile
      const playerProfile = await prisma.playerProfile.findUnique({
        where: { userId: user.id }
      });

      if (!playerProfile) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      scoutReports = await prisma.scoutReport.findMany({
        where: { playerProfileId: playerProfile.id },
        include: { 
          scout: true, 
          playerProfile: true 
        }
      });
    }

    res.status(200).json(scoutReports);
  } catch (error) {
    console.error('Get scout reports error:', error);
    res.status(500).json({ error: 'Failed to retrieve scout reports', details: error.message });
  }
};

export const getScoutReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid } 
    });

    let scoutReport;
    if (user.role === 'SCOUT') {
      // Scouts can see their own reports
      scoutReport = await prisma.scoutReport.findUnique({
        where: { id, scoutId: user.id },
        include: { 
          scout: true, 
          playerProfile: true 
        }
      });
    } else {
      // Players can see reports about their profile
      const playerProfile = await prisma.playerProfile.findUnique({
        where: { userId: user.id }
      });

      if (!playerProfile) {
        return res.status(404).json({ error: 'Player profile not found' });
      }

      scoutReport = await prisma.scoutReport.findUnique({
        where: { id, playerProfileId: playerProfile.id },
        include: { 
          scout: true, 
          playerProfile: true 
        }
      });
    }

    if (!scoutReport) {
      return res.status(404).json({ error: 'Scout report not found' });
    }

    res.status(200).json(scoutReport);
  } catch (error) {
    console.error('Get scout report by ID error:', error);
    res.status(500).json({ error: 'Failed to retrieve scout report', details: error.message });
  }
};

export const updateScoutReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comments } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid } 
    });

    // Ensure only scouts can update their own reports
    if (user.role !== 'SCOUT') {
      return res.status(403).json({ error: 'Unauthorized to update scout reports' });
    }

    const existingReport = await prisma.scoutReport.findUnique({
      where: { id, scoutId: user.id }
    });

    if (!existingReport) {
      return res.status(404).json({ error: 'Scout report not found or unauthorized' });
    }

    const updatedReport = await prisma.scoutReport.update({
      where: { id },
      data: {
        rating,
        comments
      }
    });

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Update scout report error:', error);
    res.status(500).json({ error: 'Failed to update scout report', details: error.message });
  }
};

export const deleteScoutReport = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ 
      where: { id: req.user.uid } 
    });

    // Ensure only scouts can delete their own reports
    if (user.role !== 'SCOUT') {
      return res.status(403).json({ error: 'Unauthorized to delete scout reports' });
    }

    const existingReport = await prisma.scoutReport.findUnique({
      where: { id, scoutId: user.id }
    });

    if (!existingReport) {
      return res.status(404).json({ error: 'Scout report not found or unauthorized' });
    }

    await prisma.scoutReport.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Scout report deleted successfully' });
  } catch (error) {
    console.error('Delete scout report error:', error);
    res.status(500).json({ error: 'Failed to delete scout report', details: error.message });
  }
};