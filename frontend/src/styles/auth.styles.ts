import { Platform, StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    overflow: 'hidden',
  },

  // Decorative background elements
  bgCircleTopRight: {
    position: 'absolute',
    top: -160,
    right: -160,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: 'rgba(99, 102, 241, 0.07)',
  },
  bgCircleBottomLeft: {
    position: 'absolute',
    bottom: -160,
    left: -160,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: 'rgba(139, 92, 246, 0.07)',
  },
  bgGeometric1: {
    position: 'absolute',
    top: 80,
    right: '15%',
    width: 128,
    height: 128,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
    transform: [{ rotate: '12deg' }],
  },
  bgGeometric2: {
    position: 'absolute',
    bottom: 128,
    left: '12%',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  bgGeometric3: {
    position: 'absolute',
    top: '33%',
    left: '8%',
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
    transform: [{ rotate: '-6deg' }],
  },
  bgGeometric4: {
    position: 'absolute',
    top: '50%',
    right: '10%',
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.1)',
    transform: [{ rotate: '45deg' }],
  },

  // Card
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 40,
    paddingVertical: 48,
    ...Platform.select({
      web: { boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)' },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      },
    }),
  },

  // Branding
  brandingContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoWrapper: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0A0A0A',
    letterSpacing: -0.64,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#737373',
  },

  // Divider
  dividerContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerTextWrapper: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  dividerText: {
    fontSize: 13,
    color: '#A3A3A3',
  },

  // Google button
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  googleButtonPressed: {
    borderColor: '#6366F1',
    backgroundColor: '#F8F9FF',
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0A0A0A',
  },

  // Footer
  footerContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#A3A3A3',
    textAlign: 'center',
    lineHeight: 20,
  },
  footerLink: {
    color: '#6366F1',
  },

  // Bottom tagline
  taglineContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  taglineText: {
    fontSize: 13,
    color: '#A3A3A3',
  },
});
